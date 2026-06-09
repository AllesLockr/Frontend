import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useMutation } from "@tanstack/react-query"
import { deleteVendorDataMutation } from "@/client/@tanstack/react-query.gen.ts"
import type { GetVendorDataResponseDto } from "@/client"
import { toast } from "sonner"

interface DeleteVendorDataDialogProps {
    vendorData: GetVendorDataResponseDto
    onSuccess: () => void
}

export function DeleteVendorDataDialog({
    vendorData,
    onSuccess,
}: DeleteVendorDataDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const mutation = useMutation(deleteVendorDataMutation())

    const handleConfirm = async () => {
        try {
            await mutation.mutateAsync({
                path: {
                    id: vendorData.id,
                },
            })
            onSuccess()
            setIsOpen(false)
            toast.success("Vendor data deleted successfully")
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            toast.error(errorMessage)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                aria-label="Delete vendor"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            <ConfirmDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Delete vendor data?"
                description={
                    <>
                        Are you sure you want to delete the vendor data for{" "}
                        <strong>{vendorData.forApi}</strong>? This action cannot
                        be undone.
                    </>
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmVariant="destructive"
                onConfirm={handleConfirm}
                isLoading={mutation.isPending}
            />
        </>
    )
}
