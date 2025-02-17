import { CardBody, CardFooter, CardHeader, Card as UiCard } from "@heroui/react";

type CardProperties = {
    header?: any;
    body: any;
    footer?: any;
}

export default function Card({ header, body, footer }: CardProperties) {
    return (
        <UiCard className="dark:bg-zinc-900">
            <CardHeader className="dark:text-zinc-300 text-default-500 flex justify-center text-large font-bold">
                {header}
            </CardHeader>
            <CardBody className="dark:text-zinc-300 text-default-500 flex justify-center items-center">
                {body}
            </CardBody>
            <CardFooter className="dark:text-zinc-300 text-default-500 justify-center">
                {footer}
            </CardFooter>
        </UiCard>
    );
}