import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { CreateVendorDataDialog } from "./CreateVendorDataDialog.tsx"
import type { GetVendorDataResponseDto } from "@/client"

interface EditVendorDataDialogProps {
    vendorData: GetVendorDataResponseDto
    onSuccess: () => void
}

export function EditVendorDataDialog({
    vendorData,
    onSuccess,
}: EditVendorDataDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                aria-label="Edit vendor"
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <CreateVendorDataDialog
                key={vendorData.id}
                mode="edit"
                vendorData={vendorData}
                open={isOpen}
                onOpenChange={setIsOpen}
                onSuccess={onSuccess}
            />
        </>
    )
}
