import { handleGoogleSignIn } from "@/actions/sign-in-action";
import { Button, Form } from "@heroui/react";
import { GoogleIcon } from "../icons/svgIcons";
import { getTranslation, Locale } from "@/lib/i18n";

export default function SignIn({ locale } : {locale: Locale}) {

    const handle = async (e: any) => {
        e.preventDefault();

        await handleGoogleSignIn();
    }

    return (
        <Form
            id="sign-in-form"
            onSubmit={handle}
        >
            <Button 
                id="sign-in-google-btn"
                color="primary" 
                type="submit"
                variant="ghost"
                startContent={<GoogleIcon />}
            >
                {getTranslation(locale as Locale, "signIn.signInGoogleBtn")}
            </Button>
        </Form>
    )
}
