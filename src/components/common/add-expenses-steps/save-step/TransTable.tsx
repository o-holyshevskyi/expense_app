import React from "react";
import { Selection } from "@react-types/shared";
import { Transaction } from "@/shared/interfaces/api/expenses";
import { DeleteIcon, MoneyIcon, RestoreIcon, TagIcon } from "@/components/icons/svgIcons";
import { Button, Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@heroui/react";
import RestoreTransactionModel from "./RestoreTransModal";
import MarkTransDeletedModel from "./MarkTransDeletedModel";
import EditCategoryTransModal from "./EditCategoryModal";
import { getTranslation, Locale } from "@/lib/i18n";
import { addToast } from "@heroui/toast";
import { useTheme } from "next-themes";

export interface TransTableProprs {
    transactions: Transaction[];
    saveTransactions: (transactions: TableItem[]) => void;
    locale: Locale;
}

export interface TableItem {
    transaction: Transaction;
    markedAsDeleted: boolean;
    id: string;
}
  
interface TableItems {
    items: TableItem[];
}

const actions = [
    {
        name: "edit-category",
        description: "addExpenses.saveStep.actions.changeCategory",
        icon: TagIcon,
        color: "default" as "default" | "danger" | "primary" | "secondary" | "success" | "warning" | undefined
    },
    {
        name: "delete",
        description: "addExpenses.saveStep.actions.delete",
        icon: DeleteIcon,
        color: "danger" as "default" | "danger" | "primary" | "secondary" | "success" | "warning" | undefined
    }
];

export default function TransTable({ transactions, saveTransactions, locale } : TransTableProprs) {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { theme } = useTheme();
    const tableColor = theme === "dark" ? "secondary" : "primary";
    
    // Initialize transaction list from props
    const [transactionList, setTransactionList] = React.useState<TableItems>(() => {
        if (!transactions || transactions.length === 0) {
            return { items: [] };
        }

        const trn = transactions.filter((transaction) => transaction.amount !== 0);
        const items: TableItem[] = trn.map((transaction, index) => ({
            transaction,
            markedAsDeleted: false,
            id: `transaction-${index}`,
        }));
        
        return { items };
    });
    
    // Update transactionList when props change
    React.useEffect(() => {
        if (transactions && transactions.length > 0) {
            const trn = transactions.filter((transaction) => transaction.amount !== 0);
            const items: TableItem[] = trn.map((transaction, index) => ({
                transaction,
                markedAsDeleted: false,
                id: `transaction-${index}`,
            }));
            
            setTransactionList({ items });
        }
    }, [transactions]);
    
    const [action, setAction] = React.useState<string | undefined>(undefined);
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set());
    const [disabledKeysArr, setDisabledKeys] = React.useState<Set<string>>(() => {
        const initialDisabledKeys = new Set(
            transactionList.items
                .filter(i => i.transaction.transactionDetails?.category === null)
                .map(i => i.id.toString())
        );
        return initialDisabledKeys;
    });

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [editedTransaction, setEditedTransaction] = React.useState<TableItem | null>(null);

    const handleOpen = (action: string | undefined, trans: TableItem) => {
        setAction(action);
        setEditedTransaction(trans);
        onOpen();
    };

    const totalPages = Math.ceil(transactionList.items.length / rowsPerPage);

    // Calculate items for the current page
    const pageItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return transactionList.items.slice(start, end);
    }, [page, transactionList.items, rowsPerPage]);

    // For debugging
    React.useEffect(() => {
        console.log("TransactionList items:", transactionList.items.length);
        console.log("Page items:", pageItems.length);
        console.log("Current page:", page);
        console.log("Rows per page:", rowsPerPage);
    }, [transactionList.items, pageItems, page, rowsPerPage]);

    const totalAmount = React.useMemo(() => {
        const sum = transactionList.items.reduce((acc, item) => acc + item.transaction.amount, 0);
        return sum.toFixed(2); // Round to 2 decimal places
    }, [transactionList]);

    const handleSelectionChange = (keys: Selection) => {
        if (keys === "all") {
            const allKeys = new Set(
                transactionList.items
                    .filter(item => item.transaction.transactionDetails?.category !== null && !item.markedAsDeleted)
                    .map(transaction => transaction.id.toString())
            );
            setSelectedKeys(allKeys);
        } else {
            const stringKeys = Array.from(keys).map(key => key.toString());
            const validKeys = [...stringKeys].filter(key => !disabledKeysArr.has(key));

            const selectedKeys = new Set(validKeys);
            setSelectedKeys(selectedKeys);
        }
    };

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const getSelectedItems = React.useCallback(() => {
        return transactionList.items.filter(item => selectedKeys.has(item.id.toString()));
    }, [selectedKeys, transactionList.items]);

    const totalAmountOfSelectedTransaction = React.useMemo(() => {
        const sum = getSelectedItems().reduce((acc, item) => acc + item.transaction.amount, 0);
        return sum.toFixed(2); // Round to 2 decimal places
    }, [getSelectedItems]);

    const handleSubmitTransactions = () => {
        const selectedItems = getSelectedItems();
        saveTransactions(selectedItems);

        addToast({
            title: getTranslation(locale, "toast.addTransactions.title"),
            description: getTranslation(locale, "toast.addTransactions.description"),
            color: "success",
            icon: <MoneyIcon width={28} height={28} color="success" />,
        });
    }

    const handleConfirmCategory = (newCategory: string) => {
        if (editedTransaction) {
            if (newCategory !== '')
            {
                const updatedTransaction: TableItem = {
                    ...editedTransaction,
                    transaction: {
                        ...editedTransaction.transaction,
                        transactionDetails: {
                            ...editedTransaction.transaction.transactionDetails,
                            category: newCategory,
                        },
                    },
                };

                const updatedTransactions = transactionList.items.map((transaction) =>
                    transaction.id === editedTransaction.id ? updatedTransaction : transaction
                );
    
                setTransactionList({ items: updatedTransactions });
                setEditedTransaction(null);

                addToast({
                    title: getTranslation(locale as Locale, "toast.changeCategory.title"),
                    description: getTranslation(locale  as Locale, "toast.changeCategory.description"),
                    color: "warning",
                    icon: <TagIcon width={28} height={28} color="warning" />,
                });
            }
        }
    };

    const handleMarkTransactionDeleted = () => {
        if (editedTransaction) {
            const updatedTransaction = { ...editedTransaction, markedAsDeleted: true };
            
            // Update the transaction list to mark the transaction as deleted
            const updatedTransactions = transactionList.items.map((transaction) =>
                transaction.id === editedTransaction.id ? updatedTransaction : transaction
            );
            
            setTransactionList({ items: updatedTransactions });

            setSelectedKeys((prevKeys) => {
                const updatedKeys = new Set(prevKeys);
                updatedKeys.delete(editedTransaction.id.toString());
                return updatedKeys;
            });
    
            setDisabledKeys((prevKeys) => new Set(prevKeys).add(editedTransaction.id.toString()));
            
            setEditedTransaction(null);
            onClose();

            addToast({
                title: getTranslation(locale as Locale, "toast.markAsDeleted.title"),
                description: getTranslation(locale  as Locale, "toast.markAsDeleted.description"),
                color: "warning",
                icon: <DeleteIcon width={28} height={28} color="warning" />,
            });
        }
    }

    const handleRestoreTransaction = () => {
        if (editedTransaction) {
            const updatedTransaction = { ...editedTransaction, markedAsDeleted: false };
    
            const updatedTransactions = transactionList.items.map((transaction) =>
                transaction.id === editedTransaction.id ? updatedTransaction : transaction
            );
    
            setTransactionList({ items: updatedTransactions });
    
            // Remove the transaction ID from the deleted set
            setDisabledKeys((prevKeys) => {
                const newKeys = new Set(prevKeys);
                newKeys.delete(editedTransaction.id.toString());
                return newKeys;
            });
    
            setEditedTransaction(null);
            onClose();

            addToast({
                title: getTranslation(locale as Locale, "toast.restoreTransaction.title"),
                description: getTranslation(locale  as Locale, "toast.restoreTransaction.description"),
                color: "success",
                icon: <RestoreIcon width={28} height={28} color="success" />,
            });
        }
    };

    const renderCell = React.useCallback((columnKey: React.Key, tableItem: TableItem) => {
        if (!tableItem || !tableItem.transaction) {
            return null;
        }
        
        switch (columnKey) {
            case "date":
                return tableItem.transaction.date;
            case "amount":
                return `${tableItem.transaction.amount}`;
            case "description":
                return tableItem.transaction.description;
            case "counterAccountNumber":
                return tableItem.transaction.counterAccountNumber || '-';
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        {tableItem.markedAsDeleted ? (
                            <Tooltip className="text-default-500" content={getTranslation(locale, "addExpenses.saveStep.actions.restore")}>
                                <Button
                                    onPress={() => handleOpen('restore', tableItem)}
                                    isIconOnly
                                    variant="light"
                                    color="success"
                                    endContent={
                                        <span className="text-lg text-success-400 cursor-pointer active:opacity-50">
                                            <RestoreIcon />
                                        </span>
                                    }
                                    isDisabled={!tableItem.markedAsDeleted}
                                />
                            </Tooltip>
                        ) : (
                        actions.map((action) => (
                            <Tooltip className="text-default-500" key={action.name} content={getTranslation(locale, action.description)}>
                                <Button
                                    onPress={() => handleOpen(action.name, tableItem)}
                                    isIconOnly
                                    variant="light"
                                    color={action.color}
                                    endContent={
                                        <span className={`text-lg text-${action.color}-400 cursor-pointer active:opacity-50`}>
                                            <action.icon />
                                        </span>
                                    }
                                    isDisabled={tableItem.markedAsDeleted || tableItem.transaction.transactionDetails?.category === null}
                                />
                            </Tooltip>
                        ))
                        )}
                    </div>
                );
            case "category":
                return(
                    <div>
                        {tableItem.transaction.transactionDetails?.category && (
                            <Chip className="text-default-500" color="default" variant="bordered">
                                {tableItem.transaction.transactionDetails.category}
                            </Chip>
                        )}
                    </div>
                );
            case "name":
                return tableItem.transaction.transactionDetails?.name || "-";
            case "location":
                    return tableItem.transaction.transactionDetails?.location || "-";
            default:
                const value = tableItem.transaction[columnKey as keyof Transaction];
                return value ? String(value) : '';
        }
    }, [handleOpen]);

    const getPluralForm = (count: number): 'one' | 'few' | 'many' => {
        if (count % 10 === 1 && count % 100 !== 11) return 'one';
        if (
          [2, 3, 4].includes(count % 10) &&
          ![12, 13, 14].includes(count % 100)
        ) return 'few';
        return 'many';
    };

    const topContent = React.useMemo(() => {
        return(
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    {getTranslation(
                        locale,
                        `addExpenses.saveStep.transactionSummary.total.${getPluralForm(transactionList.items.length)}`
                    ).replace("{{count}}", transactionList.items.length.toString())}

                    <span className="ml-6 text-default-400 text-small">
                        {disabledKeysArr.size === 0
                        ? getTranslation(locale, "addExpenses.saveStep.transactionSummary.removed.none")
                        : getTranslation(
                            locale,
                            `addExpenses.saveStep.transactionSummary.removed.${getPluralForm(disabledKeysArr.size)}`
                            ).replace("{{count}}", disabledKeysArr.size.toString())}
                    </span>
                </span>
                <label className="flex items-center text-default-400 text-small">
                    {getTranslation(locale, "addExpenses.saveStep.pagination.rowsPerPageLabel")}
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </label>
            </div>
        );
    }, [transactionList.items.length, disabledKeysArr.size, onRowsPerPageChange, locale]);

    const bottomContent = React.useMemo(() => {
        return(
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys.size === transactionList.items.length
                        ? getTranslation(locale, "addExpenses.saveStep.selectionSummary.allSelected")
                        : getTranslation(locale, "addExpenses.saveStep.selectionSummary.partialSelected")
                            .replace("{{selected}}", selectedKeys.size.toString())
                            .replace("{{total}}", transactionList.items.length.toString())
                    }
                </span>
                {transactionList.items.length > rowsPerPage && (
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color={tableColor}
                            page={page}
                            total={totalPages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>)
                }                        
                <div className="flex items-center justify-between gap-4">
                    <Chip 
                        variant="bordered" 
                        color={Number(totalAmount) > 0 ? "success" : Number(totalAmount) === 0 ? "warning" : "danger"}>
                        {totalAmount}
                    </Chip>
                    <Chip 
                        variant="bordered" 
                        color="warning"
                    >
                        {totalAmountOfSelectedTransaction}    
                    </Chip>
                    <Button
                        isDisabled={selectedKeys.size === 0}
                        type="submit"
                        color="success"
                        onPress={handleSubmitTransactions}
                    >
                        {getTranslation(locale, "common.add")}
                    </Button>
                </div>
            </div>
        );
    }, [
        selectedKeys.size, 
        transactionList.items.length,
        rowsPerPage,
        page,
        totalPages,
        totalAmount,
        handleSubmitTransactions,
        locale
    ]);

    return(
        <div className="flex flex-col gap-3 mt-4 text-default-500">
            <Table
                color={tableColor}
                aria-label="Transactions table"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                disabledKeys={disabledKeysArr}
                onSelectionChange={handleSelectionChange}
                topContent={topContent}
                bottomContent={bottomContent}
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn key="date">{getTranslation(locale, "addExpenses.saveStep.tableColumns.date")}</TableColumn>
                    <TableColumn key="amount">{getTranslation(locale, "addExpenses.saveStep.tableColumns.amount")}</TableColumn>
                    <TableColumn key="name">{getTranslation(locale, "addExpenses.saveStep.tableColumns.name")}</TableColumn>
                    <TableColumn key="description">{getTranslation(locale, "addExpenses.saveStep.tableColumns.description")}</TableColumn>
                    <TableColumn key="location">{getTranslation(locale, "addExpenses.saveStep.tableColumns.location")}</TableColumn>
                    <TableColumn key="counterAccountNumber">{getTranslation(locale, "addExpenses.saveStep.tableColumns.counterAccountNumber")}</TableColumn>
                    <TableColumn key="category">{getTranslation(locale, "addExpenses.saveStep.tableColumns.category")}</TableColumn>
                    <TableColumn key="actions">{getTranslation(locale, "addExpenses.saveStep.tableColumns.actions")}</TableColumn>
                </TableHeader>
                {/* Add fallback for empty pageItems */}
                {pageItems.length > 0 ? (
                    <TableBody items={pageItems}>
                        {(item) => (
                            <TableRow key={item.id} className={item.markedAsDeleted ? 'text-danger' : ''}>
                                {(columnKey) => <TableCell>{renderCell(columnKey, item)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                ) : (
                    <TableBody emptyContent="n/a">
                        {[]}
                    </TableBody>
                )}
            </Table>
            {action === "edit-category" && (
                <EditCategoryTransModal 
                    onClose={onClose} 
                    isOpen={isOpen} 
                    onOpenChange={onOpenChange}
                    onConfirm={handleConfirmCategory}
                />
            )}
            {action === "delete" && (
                <MarkTransDeletedModel 
                    onClose={onClose} 
                    isOpen={isOpen} 
                    onOpenChange={onOpenChange}
                    onConfirm={handleMarkTransactionDeleted}
                />
            )}
            {action === "restore" && (
                <RestoreTransactionModel
                    onClose={onClose}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onConfirm={handleRestoreTransaction}
                />
            )}
        </div>
    );
}