import SignIn from "@/components/auth/Sign-in";
import Card from "@/components/common/Card";
import Footer from "@/components/common/Footer";
import { getTranslation, Locale } from "@/lib/i18n";
import { useRouter } from "next/router";

export default function SignInPage() {
    const router = useRouter();
    const { locale } = router;

    return (
        <div id="sign-in-card" className="dark:text-zinc-300 dark:bg-zinc-950 flex justify-center items-center h-screen">
            <Card
                key="sign-in-card"
                header={<p id="sign-in-card-header">{getTranslation(locale as Locale, "signIn.signInCardHeader")}</p>}
                body={<SignIn locale={locale as Locale} />}
                footer={<Footer locale={locale as Locale} />}
            />
        </div>
    );
}
