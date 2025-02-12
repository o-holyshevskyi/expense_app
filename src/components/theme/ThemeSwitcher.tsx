import { Switch } from "@heroui/react";
import {useTheme} from "next-themes";
import { SunIcon, MoonIcon } from "../icons/svgIcons";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()

    const handleChange = () => {
        if (theme === "light")
            setTheme("dark")
        else
            setTheme("light")
    }

    return (
        <Switch
            defaultSelected
            color="default"
            size="sm"
            endContent={<MoonIcon />}
            startContent={<SunIcon />}
            onValueChange={handleChange}
        />
    )
};