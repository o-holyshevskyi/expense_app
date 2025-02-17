import { getTranslation, Locale } from "@/lib/i18n";
import { Checkbox, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { WhiteListedEmails } from "../../../auth";
import { useTheme } from "next-themes";

const getWhiteListedEmailsTableColumns = (locale: Locale) => [
    { id: 'email', name: getTranslation(locale, "settings.whiteListedEmailsTableColumns[0]") },
    { id: 'role', name: getTranslation(locale, "settings.whiteListedEmailsTableColumns[1]") },
    { id: 'added', name: getTranslation(locale, "settings.whiteListedEmailsTableColumns[2]") },
    { id: 'changed', name: getTranslation(locale, "settings.whiteListedEmailsTableColumns[3]") },
    { id: 'isListed', name: getTranslation(locale, "settings.whiteListedEmailsTableColumns[4]") },
];

export default function UserManagment({ locale }: { locale: Locale }) {
    const { theme } = useTheme();
    const [whiteListedEmails, setWhiteListedEmails] = useState<WhiteListedEmails[]>([]);
    const [whiteListedEmailsTableColumns] = useState(getWhiteListedEmailsTableColumns(locale));

    const renderCell = useCallback((item: WhiteListedEmails, columnKey: any) => {
        switch (columnKey) {
            case 'email':
                return item.email;
            case 'role':
                return item.roles.groups.join(', ');
            case 'added':
                return item.added.toLocaleString();
            case 'changed':
                return item.changed.toLocaleString();
            case 'isListed':
                return (
                    <Checkbox
                        isSelected={item.isListed}
                        isDisabled={item.roles.groups.includes("admin")}
                        color={theme === "light" ? 'primary' : 'secondary'} // Dynamic color based on theme
                        onValueChange={async (newValue) => {
                            try {
                                setWhiteListedEmails((prev) =>
                                    prev.map((emailItem) =>
                                        emailItem.email === item.email ? { ...emailItem, isListed: newValue } : emailItem
                                    )
                                );
                                await fetch('/api/updateWhiteListedEmail', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: item.email, isListed: newValue }),
                                });
                            } catch (error) {
                                console.error('Failed to update white-listed email', error);
                            }
                        }}
                    />
                );
            default:
                return null;
        }
    }, [theme]); // Adding theme as dependency so it re-renders on theme change

    useEffect(() => {
        const fetchWhiteListedEmails = async () => {
            try {
                const response = await fetch('/api/whiteListedEmails');
                const data = await response.json();
                if (data) {
                    setWhiteListedEmails(data);
                }
            } catch (error) {
                console.error("Failed to fetch white-listed emails", error);
            }
        };

        fetchWhiteListedEmails();
    }, []);

    const userManagmentItems = [
        {
            id: "whiteListedEmails",
            label: getTranslation(locale, "settings.whiteListedEmails"),
            body: (
                <Table className="dark:text-zinc-200" aria-label="White Listed Emails">
                    <TableHeader columns={whiteListedEmailsTableColumns}>
                        {(column) => (
                            <TableColumn key={column.id}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={whiteListedEmails}>
                        {(item) => (
                            <TableRow itemID={item.id.toString()}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )
        }
    ];

    return (
        <div className="">
            {userManagmentItems.map(item => (
                <div key={item.id}>
                    <label className="dark:text-zinc-200 bg-white dark:bg-zinc-800 px-2">
                        {item.label}
                    </label>
                    {item.body}
                </div>
            ))}
        </div>
    );
}
