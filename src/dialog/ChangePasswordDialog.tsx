import { useAuth } from "@/context/AuthContext.tsx"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { resetPasswordMutation } from "@/client/@tanstack/react-query.gen.ts"
import { toast } from "sonner"
import type { ErrorResponse } from "@/client"

export function ChangePasswordDialog() {
    const { user, userId, updateToken } = useAuth()
    const queryClient = useQueryClient()

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const { mutate, isPending } = useMutation(resetPasswordMutation())

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", {
                description: "Please make sure both passwords are identical.",
            })
            return
        }

        mutate(
            { body: { oldPassword, newPassword } },
            {
                onSuccess: (data) => {
                    updateToken(data.jwtToken)
                    setOldPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    queryClient.invalidateQueries({
                        queryKey: ["user", userId],
                    })
                    toast.success("Password changed")
                },
                onError: (error: ErrorResponse) => {
                    if (error?.status === 401) {
                        toast.error("Current password is incorrect")
                    } else {
                        toast.error("Failed to change password", {
                            description: error.message ?? "Please try again.",
                        })
                    }
                },
            }
        )
    }

    return (
        <Dialog open={user?.mustChangePassword ?? false}>
            <DialogContent
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                        You must change your password before you can continue.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleChangePassword()
                    }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                            Current password
                        </Label>
                        <Input
                            id="currentPassword"
                            autoComplete="current-password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input
                            id="newPassword"
                            autoComplete="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm new password
                        </Label>
                        <Input
                            id="confirmPassword"
                            autoComplete="new-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save password"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
