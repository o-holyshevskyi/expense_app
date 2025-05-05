import { getTranslation, Locale } from "@/lib/i18n";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useRouter } from "next/router";


interface EditTransModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    onConfirm: () => void;
}

const MarkTransDeletedModel: React.FC<EditTransModalProps> = ({ isOpen, onOpenChange, onClose, onConfirm }) => {
    const { locale } = useRouter();
    
    return (
        <Modal
            backdrop="opaque" 
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
                    {getTranslation(locale as Locale, "modals.markAsDeleted.description")}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="flat" onPress={onClose}>
                        {getTranslation(locale as Locale, "modals.markAsDeleted.cancelBtn")}
                    </Button>
                    <Button 
                        color="danger" 
                        onPress={onConfirm}
                    >
                        {getTranslation(locale as Locale, "modals.markAsDeleted.confirmBtn")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default MarkTransDeletedModel; 