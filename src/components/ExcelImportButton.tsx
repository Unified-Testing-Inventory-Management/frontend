import { Activity, useRef, useState } from "react";
import { CheckCircle2Icon, ImportIcon } from "lucide-react";
import { useImportProductFromExcel } from "@/services/product_services";
import { Alert, AlertTitle } from "./ui/alert";

export default function ExcelImportButton() {
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const importProduct = useImportProductFromExcel();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                console.log("Selected file:", file);
                await importProduct.mutateAsync(file, {
                    onSuccess: (data) => {
                        console.log("Import completed!");
                        setIsSuccess(true)
                        setMessage(data.message)
                        e.target.value = "";
                    }
                });

            } catch (error) {
                console.error("Import failed:", error);
            }
        }
    };

    return (
        <div>
            <Activity mode={isSuccess ? 'visible' : 'hidden'}>
                <Alert className="animate-fade-in-out bg-green-500 w-70 absolute right-2 top-4">
                    <CheckCircle2Icon color='white' />
                    <AlertTitle>
                        <span className="text-white text-[16px] font-bold">{message}</span>
                    </AlertTitle>
                </Alert>
            </Activity>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <button
                type="button"
                onClick={handleClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                <span className="text-sm text-muted-foreground">Import Excel</span>
                <ImportIcon className="opacity-60 w-5 h-5" />
            </button>
        </div>
    );
}
