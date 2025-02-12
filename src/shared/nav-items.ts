import { AddExpenseIcon, MyExpensesIcon } from '../components/icons/svgIcons';

export const navItems = [
    {
        href: "/add-expense",
        id: "add-expense",
        icon: AddExpenseIcon({ width: 36, height: 36 }),
        label: "Add Expense",
        isDisplayed: true
    },
    {
        href: "/my-expenses",
        id: "my-expenses",
        icon: MyExpensesIcon({ width: 36, height: 36 }),
        label: "My Expenses",
        isDisplayed: true
    },
]