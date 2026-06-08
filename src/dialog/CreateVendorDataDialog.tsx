import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { implementedVendorsOptions, addVendorDataMutation } from "@/client/@tanstack/react-query.gen.ts"

interface CreateVendorDataDialogProps {
    onSuccess: () => void
}

export function CreateVendorDataDialog({ onSuccess }: CreateVendorDataDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("apiKey")
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutation(addVendorDataMutation())

    const { data: implementedVendorsData } = useQuery(
        implementedVendorsOptions({}),
    )

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setApiError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setApiError(null)

        const formData = new FormData(e.currentTarget)
        const forApi = formData.get("forApi") as string
        const baseUrl = formData.get("baseUrl") as string

        let payload: any = {
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

        try {
            await mutateAsync({
                body: payload,
            })

            setIsOpen(false)
            queryClient.invalidateQueries({ queryKey: ["vendors"] })
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
            <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Create</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create new vendor data</DialogTitle>
                        <DialogDescription>
                            Add credentials for an implemented vendor. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="forApi" className="text-right">
                                For API
                            </Label>
                            <div className="col-span-3">
                                <Select name="forApi" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {implementedVendorsData?.apis.map((apiName) => (
                                            <SelectItem key={apiName} value={apiName}>
                                                {apiName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            />
                        </div>

                        <Tabs defaultValue="apiKey" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="apiKey">API Key</TabsTrigger>
                                <TabsTrigger value="baseAuth">Base Auth</TabsTrigger>
                            </TabsList>
                            <TabsContent value="apiKey" className="space-y-4 pt-4 min-h-[120px]">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="apiKey" className="text-right">
                                        API Key
                                    </Label>
                                    <Input
                                        id="apiKey"
                                        name="apiKey"
                                        className="col-span-3"
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="baseAuth" className="space-y-4 pt-4 min-h-[120px]">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="apiUsername" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="apiUsername"
                                        name="apiUsername"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="apiPassword" className="text-right">
                                        Password
                                    </Label>
                                    <Input
                                        id="apiPassword"
                                        name="apiPassword"
                                        type="password"
                                        className="col-span-3"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
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