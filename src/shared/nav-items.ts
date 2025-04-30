import { getTranslation, Locale } from '@/lib/i18n';
import { AddExpenseIcon, MyExpensesIcon, TagsCategoriesIcon } from '../components/icons/svgIcons';

export const navItems = (locale: Locale, { width = 36, height = 36} = {}) => [
    {
        href: "/add-expenses",
        id: "add-expenses",
        icon: AddExpenseIcon({ width: width, height: height }),
        label: getTranslation(locale, "sidebar.topSidebarItems[0]"),
        isDisplayed: true
    },
    {
        href: "/my-expenses",
        id: "my-expenses",
        icon: MyExpensesIcon({ width: width, height: height }),
        label: getTranslation(locale, "sidebar.topSidebarItems[1]"),
        isDisplayed: true
    },
    {
        href: "/expense-categories",
        id: "expense-categories",
        icon: TagsCategoriesIcon({ width: width, height: height }),
        label: getTranslation(locale, "sidebar.topSidebarItems[2]"),
        isDisplayed: true
    }
]