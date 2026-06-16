import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { implementedVendorsOptions } from "@/client/@tanstack/react-query.gen.ts"
import { cn } from "@/lib/utils"
import { CreateIseoLock } from "@/dialog/CreateIseoLock.tsx"
import { CreateAssaAmockLock } from "@/dialog/CreateAssaAmockLock.tsx"

interface CreateLockDialogProps {
    onSuccess: () => void
}

const STEPS = [
    { id: 1, label: "Select vendor" },
    { id: 2, label: "Configure lock" },
] as const

function VendorForm({ vendor }: { vendor: string }) {
    const normalized = vendor.toLowerCase()

    if (normalized.includes("iseo")) {
        return <CreateIseoLock vendor={vendor} />
    }
    if (normalized.includes("assa")) {
        return <CreateAssaAmockLock vendor={vendor} />
    }

    return (
        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
            <span className="font-medium">Unsupported vendor</span>
            <span className="text-sm text-muted-foreground">
                No lock creation form is available for "{vendor}".
            </span>
        </div>
    )
}

export function CreateLockDialog({ onSuccess }: CreateLockDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [selectedVendor, setSelectedVendor] = useState("")

    const { data: implementedVendorsData } = useQuery(
        implementedVendorsOptions()
    )

    const vendors = implementedVendorsData?.apis ?? []

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open) {
            setStep(1)
            setSelectedVendor("")
        }
    }

    const handleCreate = () => {
        // TODO: Persist the lock once a createLock backend endpoint exists.
        setIsOpen(false)
        onSuccess()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Create</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Create new lock</DialogTitle>
                    <DialogDescription>
                        Choose a vendor and configure the lock. Click create when
                        you're done.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 py-2">
                    {STEPS.map((s, index) => (
                        <div key={s.id} className="flex flex-1 items-center gap-2">
                            <div
                                className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                                    step > s.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : step === s.id
                                            ? "border-primary text-primary"
                                            : "border-muted-foreground/30 text-muted-foreground"
                                )}
                            >
                                {step > s.id ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    s.id
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-sm whitespace-nowrap",
                                    step >= s.id
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {s.label}
                            </span>
                            {index < STEPS.length - 1 && (
                                <div className="mx-1 h-px flex-1 bg-muted-foreground/30" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="py-4">
                    {step === 1 ? (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vendor" className="text-right">
                                    Vendor
                                </Label>
                                <div className="col-span-3">
                                    <Select
                                        value={selectedVendor}
                                        onValueChange={setSelectedVendor}
                                    >
                                        <SelectTrigger id="vendor">
                                            <SelectValue placeholder="Select a vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vendors.map((vendor) => (
                                                <SelectItem
                                                    key={vendor}
                                                    value={vendor}
                                                >
                                                    {vendor}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <VendorForm vendor={selectedVendor} />
                    )}
                </div>

                <DialogFooter>
                    {step === 1 ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!selectedVendor}
                            >
                                Next
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button type="button" onClick={handleCreate}>
                                Create lock
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
