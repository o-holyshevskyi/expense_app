import { Switch } from "@heroui/react";
import {useTheme} from "next-themes";
import { SunIcon, MoonIcon } from "../icons/svgIcons";

export const ThemeSwitcher = ({ translatedSideBarLabel }: { translatedSideBarLabel: string } ) => {
    const { theme, setTheme } = useTheme()

    const handleChange = () => {
        if (theme === "light")
            setTheme("dark")
        else
            setTheme("light")
    }

    return (
        <div className="flex items-center gap-4">
            <Switch
                defaultSelected
                color="default"
                size="sm"
                endContent={<MoonIcon />}
                startContent={<SunIcon />}
                onValueChange={handleChange}
            />
            {translatedSideBarLabel}
        </div>
    )
};