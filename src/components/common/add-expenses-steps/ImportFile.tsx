import { AIIcon, BellIcon, CancelIcon, FileIcon, UploadIcon, ViewIcon } from "@/components/icons/svgIcons";
import { getTranslation, Locale } from "@/lib/i18n";
import ExpencesResponse from "@/shared/interfaces/api/expenses";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";

interface ImportFileProps {
    locale: Locale;
    onFileUploaded?: (isProcessed: boolean, processedExpences?: ExpencesResponse, isProcessing?: boolean) => void;
}

export default function ImportFile({ locale, onFileUploaded }: ImportFileProps) {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
    const [fileName, setFileName] = useState<string | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processedExpences, setProcessedExpences] = useState<ExpencesResponse | undefined>(undefined);

    useEffect(() => {
        if (onFileUploaded) {
            onFileUploaded(isFileProcessed, processedExpences, isProcessing);
        }
    }, [isFileProcessed, isProcessing, onFileUploaded]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setUploadedFile(file);

            addToast({
                title: getTranslation(locale, "toast.fileUploaded"),
                color: "primary",
                icon: (<FileIcon width={28} height={28} color="primary" />)
            });
            
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    const clearFile = () => {
        setFileName(undefined);
        setUploadedFile(undefined);
        
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(undefined);
        }
        setShowPreview(false);
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    const processFile = async () => {
        if (!uploadedFile) return;

        try {
            setIsProcessing(true);

            const formData = new FormData();
            formData.append("file", uploadedFile);

            const result = await fetch("/api/file-process/process-pdf", {
                method: "POST",
                body: formData,
            });

            const json = await result.json() as { raw: string; json: ExpencesResponse };

            setProcessedExpences(json.json);
            setIsFileProcessed(true);
            setIsProcessing(false);

            addToast({
                title: getTranslation(locale, "toast.fileProcessed"),
                color: "success",
                icon: (<BellIcon width={28} height={28} color="success" />)
            });
        } catch (error: any) {
            setProcessedExpences(undefined);
            setIsFileProcessed(false);
            setIsProcessing(false);

            addToast({
                title: error.message,
                color: "danger",
            });
        }
    }

    return (
        <div className="flex mt-[20rem] w-full flex-col items-center justify-center">
            <p className="text-default-500 text-small">{getTranslation(locale, "addExpenses.importStep.description")}</p>
            <div className="flex flex-col items-center justify-center">
                {!fileName && <Button
                        color="default"
                        size="md"
                        className="mt-4 text-default-500"
                        as="label"
                        variant="bordered"
                        startContent={<UploadIcon width={28} height={28} />}    
                    >
                        {getTranslation(locale, "addExpenses.importStep.uploadBtn")}
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </Button>}
                {fileName && 
                    <div className="flex items-center justify-between gap-5 mt-2 text-default-500 text-small">
                        <p>{fileName}</p>
                        <div className="flex items-center gap-2">
                            <Tooltip
                                className="text-default-500" content={getTranslation(locale, "common.preview")}
                            >
                                <Button
                                    isIconOnly
                                    size="sm"
                                    color="primary"
                                    variant="light"
                                    className="h-8 w-8"
                                    onPress={togglePreview}
                                    startContent={<ViewIcon  width={28} height={28} />}
                                />
                            </Tooltip>
                            {!isFileProcessed && !isProcessing && (
                                <Tooltip
                                 className="text-default-500" content={getTranslation(locale, "common.process")}
                                >
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="success"
                                        variant="light"
                                        className="h-8 w-8"
                                        onPress={processFile}
                                        startContent={<AIIcon  width={28} height={28} />}
                                    />
                                </Tooltip>
                            )}
                            {!isFileProcessed && !isProcessing && (
                                <Tooltip
                                    className="text-default-500" content={getTranslation(locale, "common.delete")}
                                >
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        className="h-8 w-8"
                                        onPress={clearFile}
                                        startContent={<CancelIcon  width={28} height={28} />}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                }
            </div>

            {/* PDF Preview Modal */}
            {showPreview && previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-medium">{fileName}</h3>
                            <Button 
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                className="h-8 w-8"
                                onPress={togglePreview}
                                startContent={<CancelIcon />}
                            />
                        </div>
                        
                        <div className="p-1 h-[70vh]">
                            <iframe 
                                src={`${previewUrl}#toolbar=0`} 
                                className="w-full h-full border-0" 
                                title="PDF Preview"
                            />
                        </div>
                        
                        <div className="p-4 border-t flex justify-end gap-2">
                            <Button 
                                color="default"
                                onPress={togglePreview}
                            >
                                {getTranslation(locale, "common.close")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}