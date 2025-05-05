import { Transaction } from "@/shared/interfaces/api/expenses";
import { useEffect, useState } from "react";
import TransTable, { TableItem } from "./save-step/TransTable";
import { Locale } from "@/lib/i18n";

interface SaveExpensesProps {
    extractedData: Transaction[] | undefined;
    handleReviewedExpenses: (transactions: TableItem[]) => void;
    locale: Locale;
}

export default function SaveExpenses({ extractedData, handleReviewedExpenses, locale }: SaveExpensesProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (extractedData) {
            const transactions = extractedData;
            setTransactions(transactions);
        }
    }, [extractedData]);

    const handleSavingTransactions = (tableItems: TableItem[]) => {
        handleReviewedExpenses(tableItems);
    };

    return (
        <div>
            <TransTable 
                transactions={transactions} 
                saveTransactions={handleSavingTransactions}
                locale={locale} 
            />
        </div>
    );
}