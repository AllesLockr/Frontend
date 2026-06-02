// components/CreatePersonDialog.tsx
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

import { createPersonMutation } from "@/client/@tanstack/react-query.gen.ts"
import { useMutation } from "@tanstack/react-query"

interface CreatePersonDialogProps {
    onSuccess: () => void
}

export function CreatePersonDialog({ onSuccess }: CreatePersonDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const { mutateAsync, isPending } = useMutation(createPersonMutation())

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
        const firstname = formData.get("firstname") as string
        const lastname = formData.get("lastname") as string
        const email = formData.get("email") as string

        try {
            await mutateAsync({
                body: {
                    firstname,
                    lastname,
                    email,
                },
            })

            setIsOpen(false)
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
                        <DialogTitle>Create new person</DialogTitle>
                        <DialogDescription>
                            Add a new person to the system. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstname" className="text-right">
                                Firstname
                            </Label>
                            <Input
                                id="firstname"
                                name="firstname"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastname" className="text-right">
                                Lastname
                            </Label>
                            <Input
                                id="lastname"
                                name="lastname"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                className="col-span-3"
                                required
                            />
                        </div>
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
                            {isPending ? "Saving..." : "Save person"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
