
import { getTranslation, Locale } from "@/lib/i18n";
import { Category } from "@/pages/expense-categories";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup } from "@heroui/react";
import { useRouter } from "next/router";
import { get } from "node:http";
import React, { useEffect, useState } from "react";

interface EditTransModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    onConfirm: (category: string) => void;
}

const EditCategoryTransModal: React.FC<EditTransModalProps> = ({ isOpen, onOpenChange, onClose, onConfirm }) => {
    const [selected, setSelected] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const { locale } = useRouter();
    
    useEffect(() => {
        if (locale) {
          fetch(`/api/categories?locale=${locale}`)
            .then((response) => response.json())
            .then((data) => {
              setCategories(data.categories);
            });
        }
      }, [locale]);

    const handleCancel = () => {
        setSelected('');
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(selected);
        setSelected('');
        onClose();
    };

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
                <ModalHeader className="flex text-large gap-1">
                    {getTranslation(locale as Locale, "modals.changeCategory.title")}
                </ModalHeader>
                <ModalBody className="flex flex-col gap-3 text-default-500">
                    <RadioGroup
                        label={getTranslation(locale as Locale, "modals.changeCategory.description")}
                        orientation="horizontal"
                        onValueChange={setSelected}
                        value={selected}
                        className="flex flex-col gap-2"
                    >
                        {categories.map((category) => (
                            <Chip
                                className="text-default-500" color="default" variant="bordered"
                            >
                                <Radio 
                                    classNames={{
                                        label: "text-default-500",
                                    }} 
                                    color="primary" 
                                    value={category.title}
                                >{category.title}</Radio>
                            </Chip>
                        ))}
                    </RadioGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={handleCancel}>
                        {getTranslation(locale as Locale, "modals.changeCategory.cancelBtn")}
                    </Button>
                    <Button 
                        color="primary" 
                        onPress={handleConfirm}
                        isDisabled={selected === ''}
                    >
                        {getTranslation(locale as Locale, "modals.changeCategory.confirmBtn")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditCategoryTransModal;