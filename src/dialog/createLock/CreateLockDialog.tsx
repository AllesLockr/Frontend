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
import { getAllVendorDataOptions } from "@/client/@tanstack/react-query.gen.ts"
import type { GetVendorDataResponseDto } from "@/client"
import { cn } from "@/lib/utils"
import { resolveVendorStepsHook } from "@/dialog/createLock/registry.tsx"

interface CreateLockDialogProps {
    onSuccess: () => void
}

const SELECT_VENDOR_LABEL = "Select vendor"

interface StepperProps {
    labels: string[]
    activeIndex: number
}

function Stepper({ labels, activeIndex }: StepperProps) {
    return (
        <div className="flex items-center gap-2 py-2">
            {labels.map((label, index) => {
                const id = index + 1
                const isDone = activeIndex > index
                const isActive = activeIndex === index
                return (
                    <div key={label} className="flex flex-1 items-center gap-2">
                        <div
                            className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                                isDone
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : isActive
                                        ? "border-primary text-primary"
                                        : "border-muted-foreground/30 text-muted-foreground",
                            )}
                        >
                            {isDone ? <Check className="h-4 w-4" /> : id}
                        </div>
                        <span
                            className={cn(
                                "text-sm whitespace-nowrap",
                                activeIndex >= index
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            {label}
                        </span>
                        {index < labels.length - 1 && (
                            <div className="mx-1 h-px flex-1 bg-muted-foreground/30" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

interface VendorStepSelectProps {
    vendors: GetVendorDataResponseDto[]
    selectedVendor: string
    onSelect: (value: string) => void
}

function VendorStepSelect({
    vendors,
    selectedVendor,
    onSelect,
}: VendorStepSelectProps) {
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor" className="text-right">
                    Vendor
                </Label>
                <div className="col-span-3">
                    <Select value={selectedVendor} onValueChange={onSelect}>
                        <SelectTrigger id="vendor">
                            <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                        <SelectContent>
                            {vendors.map((vendor) => (
                                <SelectItem
                                    key={vendor.id}
                                    value={vendor.forApi}
                                >
                                    {vendor.forApi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

interface VendorWizardProps {
    vendorData: GetVendorDataResponseDto
    // Global step index: 0 = select vendor, >= 1 = vendor steps.
    step: number
    onStepChange: (step: number) => void
    onBackToStart: () => void
    onCreate: () => void
    selectVendorContent: React.ReactNode
}

/**
 * Owns the steps for a single vendor. Must be remounted (keyed) per vendor so
 * the resolved vendor hook is called unconditionally per mount.
 */
function VendorWizard({
    vendorData,
    step,
    onStepChange,
    onBackToStart,
    onCreate,
    selectVendorContent,
}: VendorWizardProps) {
    const useVendorSteps = resolveVendorStepsHook(vendorData.forApi)
    const { steps, isLoading } = useVendorSteps(vendorData)

    const labels = [SELECT_VENDOR_LABEL, ...steps.map((s) => s.label)]
    const lastIndex = labels.length - 1
    const isFirst = step === 0
    const isLast = step === lastIndex

    // Vendor step content is offset by 1 (index 0 is the select-vendor step).
    const vendorStep = isFirst ? undefined : steps[step - 1]

    return (
        <>
            <Stepper labels={labels} activeIndex={step} />

            <div className="py-4">
                {isFirst ? selectVendorContent : vendorStep?.content}
            </div>

            <DialogFooter>
                {isFirst ? (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBackToStart}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => onStepChange(step + 1)}
                            disabled={isLoading}
                        >
                            Next
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onStepChange(step - 1)}
                        >
                            Back
                        </Button>
                        {isLast ? (
                            <Button type="button" onClick={onCreate}>
                                Create lock
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => onStepChange(step + 1)}
                                disabled={isLoading}
                            >
                                Next
                            </Button>
                        )}
                    </>
                )}
            </DialogFooter>
        </>
    )
}

export function CreateLockDialog({ onSuccess }: CreateLockDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [selectedVendor, setSelectedVendor] = useState("")

    const { data: vendorDataList } = useQuery(getAllVendorDataOptions())

    const vendors = vendorDataList ?? []
    const selectedVendorData = vendors.find((v) => v.forApi === selectedVendor)

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open) {
            setStep(0)
            setSelectedVendor("")
        }
    }

    const handleCreate = () => {
        // TODO: Persist the lock once a createLock backend endpoint exists.
        setIsOpen(false)
        onSuccess()
    }

    const selectVendorContent = (
        <VendorStepSelect
            vendors={vendors}
            selectedVendor={selectedVendor}
            onSelect={setSelectedVendor}
        />
    )

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
                        Choose a vendor and follow the instructions.
                    </DialogDescription>
                </DialogHeader>

                {selectedVendorData ? (
                    <VendorWizard
                        key={selectedVendorData.forApi}
                        vendorData={selectedVendorData}
                        step={step}
                        onStepChange={setStep}
                        onBackToStart={() => handleOpenChange(false)}
                        onCreate={handleCreate}
                        selectVendorContent={selectVendorContent}
                    />
                ) : (
                    <>
                        <Stepper labels={[SELECT_VENDOR_LABEL]} activeIndex={0} />
                        <div className="py-4">{selectVendorContent}</div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="button" disabled>
                                Next
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
