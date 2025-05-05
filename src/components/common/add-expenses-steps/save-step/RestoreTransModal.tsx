import { getTranslation, Locale } from "@/lib/i18n";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useRouter } from "next/router";

interface RestoreTransactionModelProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    onConfirm: () => void;
}

const RestoreTransactionModel: React.FC<RestoreTransactionModelProps> = ({
    isOpen,
    onOpenChange,
    onClose,
    onConfirm,
}) => {
    const { locale } = useRouter();
    
    return (
        <Modal backdrop="opaque" 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
            }}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
        >
            <ModalContent className="text-default-500 rounded-lg shadow-lg border border-zinc-800">
                <ModalHeader className="flex text-large gap-1" />
                <ModalBody className="flex flex-col gap-3">
                    {getTranslation(locale as Locale, "modals.restoreTransaction.description")}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        {getTranslation(locale as Locale, "modals.restoreTransaction.cancelBtn")}
                    </Button>
                    <Button 
                        color="success" 
                        onPress={onConfirm}
                    >
                        {getTranslation(locale as Locale, "modals.restoreTransaction.confirmBtn")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RestoreTransactionModel;