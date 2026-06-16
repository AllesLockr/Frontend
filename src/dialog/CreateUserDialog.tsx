import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Copy, Check } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { createUserMutation } from "@/client/@tanstack/react-query.gen.ts"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext.tsx"

interface CreateUserDialogProps {
    onSuccess: () => void
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
    const { user: currentUser } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [phase, setPhase] = useState<"form" | "result">("form")
    const [createdPassword, setCreatedPassword] = useState("")
    const [copied, setCopied] = useState(false)

    const { mutateAsync, isPending } = useMutation(createUserMutation())

    if (currentUser?.role !== "ADMIN") {
        return null
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setPhase("form")
            setApiError(null)
            setCreatedPassword("")
            setCopied(false)
        }
        setIsOpen(open)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setApiError(null)

        const formData = new FormData(e.currentTarget)
        const firstname = formData.get("firstname") as string
        const lastname = formData.get("lastname") as string
        const username = formData.get("username") as string
        const email = formData.get("email") as string

        try {
            const response = await mutateAsync({
                body: {
                    firstname,
                    lastname,
                    username,
                    email,
                },
            })

            setCreatedPassword(response.password)
            setPhase("result")
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."

            setApiError(errorMessage)
        }
    }

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(createdPassword)
            setCopied(true)
            toast.success("Password copied to clipboard")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error("Failed to copy password")
        }
    }

    const handleDone = () => {
        handleOpenChange(false)
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
            <DialogContent className="sm:max-w-[425px]">
                {phase === "form" ? (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Create new user</DialogTitle>
                            <DialogDescription>
                                Add a new user to the system. Click save when
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
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
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
                                {isPending ? "Saving..." : "Save user"}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>User created successfully</DialogTitle>
                            <DialogDescription>
                                The user has been created. Copy the password
                                below. It will not be shown again.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <Label htmlFor="generated-password">
                                Generated password
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="generated-password"
                                    value={createdPassword}
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyPassword}
                                    aria-label="Copy password"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleDone}>Done</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
