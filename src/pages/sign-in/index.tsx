import SignIn from "@/components/auth/Sign-in";
import Card from "@/components/common/Card";
import Footer from "@/components/common/Footer";
// import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

export default function SignInPage() {
    return (
        <div className="dark:text-zinc-300 dark:bg-zinc-950 flex justify-center items-center h-screen">
            <Card
                header={<p>Sign In</p>}
                body={<SignIn />}
                footer={<Footer />}
            />
        </div>
    );
}
