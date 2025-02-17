import { getTranslation, Locale } from "@/lib/i18n";

export default function Footer({ locale }: {locale: Locale}) {
    return <p id="main-footer" className="p-1 dark:text-zinc-300 text-default text-tiny">
        &copy; {new Date().getFullYear()} {getTranslation(locale, "common.mainFooter")}
    </p>
}