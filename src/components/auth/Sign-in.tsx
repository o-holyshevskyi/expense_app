import { handleGoogleSignIn } from "@/actions/sign-in-action";
import { Button, Form } from "@heroui/react";
import { GoogleIcon } from "../icons/svgIcons";

export default function SignIn() {

    const handle = async (e: any) => {
        e.preventDefault();

        await handleGoogleSignIn();
    }

    return (
        <Form
            onSubmit={handle}
        >
            <Button 
                color="primary" 
                type="submit"
                variant="ghost"
                startContent={<GoogleIcon />}
            >
                Signin with Google
            </Button>
        </Form>
    )
}
