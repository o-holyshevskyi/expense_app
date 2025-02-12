import { Alert, extendVariants } from "@heroui/react";
import { ReactNode, useState } from "react";

type AlertComponentParams = {
    title: string;
    description?: string;
    color?: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined;
    endContent?: ReactNode;
    children?: ReactNode;
    variant?: "flat" | "faded" | "solid" | "bordered" | undefined;
    isVisible: boolean;
}

export const AlertComponent = (params: AlertComponentParams) => {
    const { 
        title, 
        color, 
        description, 
        endContent,
        variant,
        children,
        isVisible,
     } = params;

    return (
        <Alert 
            isVisible={isVisible}
            color={color} 
            title={title} 
            description={description}
            endContent={endContent}
            variant={variant}
            radius="lg"
        >
            {children}
        </Alert>
    );
}