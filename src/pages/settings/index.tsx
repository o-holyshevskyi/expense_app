import UserManagment from "@/components/settings/UserManagement";
import { getTranslation, Locale } from "@/lib/i18n";
import { Tab, Tabs } from "@heroui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState } from "react";

const getSettingsTabItems = (locale: Locale) => [
    {
        id: "general",
        label: getTranslation(locale, "settings.settingsTabItems[0]"),
        child: 
            <p className="dark:text-zinc-300 text-default-500">
                TBD
            </p>
    },
    {
        id: "userManagment",
        label: getTranslation(locale, "settings.settingsTabItems[1]"),
        child: UserManagment({ locale })
    }
];

export default function SettingsPage() {
    const router = useRouter();
    const { theme } = useTheme();

    const locale = router.locale as Locale;

    const settingsTabItems = getSettingsTabItems(locale);

    // Explicitly typing `selected` as `string | number` to match the expected `Key`
    const [selected, setSelected] = useState<string | number>(settingsTabItems[0].id);
    
    return (
        <div className="flex flex-col w-full">
            <Tabs 
                size="lg" 
                aria-label="settings-tab" 
                variant="underlined" 
                color={theme === "light" ? 'primary' : 'secondary'}
                selectedKey={selected}
                onSelectionChange={(key: string | number) => setSelected(key)} // Explicitly typing here as well
            >
                {settingsTabItems.map(item => (
                    <Tab key={item.id} title={item.label}>
                        {item.child}
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
