import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useMutation, useQuery } from "@tanstack/react-query"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    implementedVendorsOptions,
    addVendorDataMutation,
    updateVendorDataMutation,
    getVendorSpecificDefinitionsOptions,
} from "@/client/@tanstack/react-query.gen.ts"
import type {
    AddVendorDataRequestSchema,
    UpdateVendorDataRequestSchema,
    GetVendorDataResponseDto,
    MetadataEntrySchema,
} from "@/client"
import { mapFieldType } from "@/lib/utils"
import React from "react"

interface CreateVendorDataDialogProps {
    onSuccess: () => void
    mode?: "create" | "edit"
    vendorData?: GetVendorDataResponseDto
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function CreateVendorDataDialog({
    onSuccess,
    mode = "create",
    vendorData,
    open: openProp,
    onOpenChange,
    trigger,
}: CreateVendorDataDialogProps) {
    const isEdit = mode === "edit"

    const [isOpenInternal, setIsOpenInternal] = useState(false)
    const isOpen = openProp ?? isOpenInternal

    const [apiError, setApiError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState(() => {
        if (isEdit && vendorData) {
            return vendorData.apiKey
                ? "apiKey"
                : vendorData.apiUsername
                    ? "baseAuth"
                    : "apiKey"
        }
        return "apiKey"
    })

    const [selectedVendor, setSelectedVendor] = useState(
        isEdit && vendorData ? vendorData.forApi : "",
    )

    const createMutation = useMutation(addVendorDataMutation())
    const updateMutation = useMutation(updateVendorDataMutation())
    const isPending = createMutation.isPending || updateMutation.isPending

    const { data: implementedVendorsData } = useQuery(
        implementedVendorsOptions(),
    )

    const { data: definitionsData } = useQuery({
        ...getVendorSpecificDefinitionsOptions({
            path: { forVendor: selectedVendor },
        }),
        enabled: !!selectedVendor,
    })

    const vendorSpecificFields = definitionsData?.vendorSpecificFields ?? []

    const getMetadataValue = (fieldName: string) =>
        vendorData?.metadata?.find((m) => m.key === fieldName)?.value ?? ""

    const handleOpenChange = (open: boolean) => {
        if (open && !isEdit) {
            setSelectedVendor("")
        }
        if (openProp !== undefined) {
            onOpenChange?.(open)
        }
        setIsOpenInternal(open)
        if (!open) {
            setApiError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setApiError(null)

        const formData = new FormData(e.currentTarget)
        const baseUrl = formData.get("baseUrl") as string

        const metadata: Array<MetadataEntrySchema> = vendorSpecificFields
            .map((field) => ({
                key: field.name,
                value: formData.get(`metadata.${field.name}`) as string,
            }))
            .filter((entry) => entry.value)

        try {
            if (isEdit) {
                const payload: UpdateVendorDataRequestSchema = {
                    forApi: vendorData!.forApi,
                    baseUrl,
                }

                if (activeTab === "apiKey") {
                    const apiKey = formData.get("apiKey") as string
                    if (apiKey) {
                        payload.apiKey = apiKey
                    }
                } else {
                    const apiUsername = formData.get("apiUsername") as string
                    const apiPassword = formData.get("apiPassword") as string
                    if (apiUsername) {
                        payload.apiUsername = apiUsername
                    }
                    if (apiPassword) {
                        payload.apiPassword = apiPassword
                    }
                }

                if (metadata.length > 0) {
                    payload.metadata = metadata
                }

                await updateMutation.mutateAsync({
                    body: payload,
                })
            } else {
                const forApi = formData.get("forApi") as string
                const payload: AddVendorDataRequestSchema = {
                    forApi,
                    baseUrl,
                }

                if (activeTab === "apiKey") {
                    const apiKey = formData.get("apiKey") as string
                    if (apiKey) {
                        payload.apiKey = apiKey
                    }
                } else {
                    const apiUsername = formData.get("apiUsername") as string
                    const apiPassword = formData.get("apiPassword") as string
                    if (apiUsername && apiPassword) {
                        payload.apiUsername = apiUsername
                        payload.apiPassword = apiPassword
                    }
                }

                if (metadata.length > 0) {
                    payload.metadata = metadata
                }

                await createMutation.mutateAsync({
                    body: payload,
                })
            }

            setIsOpenInternal(false)
            onOpenChange?.(false)
            onSuccess()
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."

            setApiError(errorMessage)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : !isEdit ? (
                <DialogTrigger asChild>
                    <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        <span>Create</span>
                    </Button>
                </DialogTrigger>
            ) : null}
            <DialogContent className="max-w-[90vw] w-fit">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit vendor data" : "Create new vendor data"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Update credentials for the vendor. Click save when you're done."
                                : "Add credentials for an implemented vendor. Click save when you're done."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="forApi" className="text-right">
                                For API
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    name="forApi"
                                    required={!isEdit}
                                    disabled={isEdit}
                                    value={selectedVendor}
                                    onValueChange={setSelectedVendor}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {implementedVendorsData?.apis.map(
                                            (apiName) => (
                                                <SelectItem
                                                    key={apiName}
                                                    value={apiName}
                                                >
                                                    {apiName}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                {isEdit && (
                                    <input
                                        type="hidden"
                                        name="forApi"
                                        value={vendorData?.forApi}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="baseUrl" className="text-right">
                                Base URL
                            </Label>
                            <Input
                                id="baseUrl"
                                name="baseUrl"
                                className="col-span-3"
                                required
                                defaultValue={
                                    isEdit ? vendorData?.baseUrl : undefined
                                }
                            />
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="apiKey">
                                    API Key
                                </TabsTrigger>
                                <TabsTrigger value="baseAuth">
                                    Base Auth
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value="apiKey"
                                className="space-y-4 pt-4 min-h-[120px]"
                            >
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="apiKey" className="text-right">
                                        API Key
                                    </Label>
                                    <Input
                                        id="apiKey"
                                        name="apiKey"
                                        className="col-span-3"
                                        defaultValue={
                                            isEdit
                                                ? vendorData?.apiKey
                                                : undefined
                                        }
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="baseAuth"
                                className="space-y-4 pt-4 min-h-[120px]"
                            >
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="apiUsername"
                                        className="text-right"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        id="apiUsername"
                                        name="apiUsername"
                                        className="col-span-3"
                                        defaultValue={
                                            isEdit
                                                ? vendorData?.apiUsername
                                                : undefined
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="apiPassword"
                                        className="text-right"
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id="apiPassword"
                                        name="apiPassword"
                                        type="password"
                                        className="col-span-3"
                                        defaultValue={
                                            isEdit
                                                ? vendorData?.apiPassword
                                                : undefined
                                        }
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        {vendorSpecificFields.length > 0 && (
                            <div className="space-y-4 border-t pt-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Vendor-specific fields
                                </p>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                                    {vendorSpecificFields.map((field) => (
                                        <React.Fragment
                                            key={`${selectedVendor}-${field.name}`}
                                        >
                                            <Label
                                                htmlFor={field.name}
                                                className="text-right whitespace-nowrap pr-2"
                                            >
                                                {field.name}
                                                {field.description && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="ml-1 inline-flex align-middle">
                                                                    <Info className="h-3 w-3 text-muted-foreground cursor-help shrink-0" />
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{field.description}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </Label>
                                            <Input
                                                id={field.name}
                                                name={`metadata.${field.name}`}
                                                type={mapFieldType(field.type)}
                                                required
                                                defaultValue={
                                                    isEdit
                                                        ? getMetadataValue(
                                                            field.name,
                                                        )
                                                        : undefined
                                                }
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {apiError && (
                        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                            {apiError}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save vendor data"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
