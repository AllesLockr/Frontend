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
            toast.error("Passwörter stimmen nicht überein", {
                description:
                    "Bitte stelle sicher, dass beide Passwörter identisch sind.",
            })
            return
        }

        mutate(
            { body: { oldPassword, newPassword } },
            {
                onSuccess: (data) => {
                    updateToken(data.jwtToken)
                    queryClient.invalidateQueries({
                        queryKey: ["user", userId],
                    })
                    toast.success("Passwort geändert")
                },
                onError: (error: ErrorResponse) => {
                    if (error?.status === 401) {
                        toast.error("Aktuelles Passwort ist falsch")
                    } else {
                        toast.error("Fehler beim Ändern des Passworts", {
                            description:
                                error.message ?? "Bitte versuche es erneut.",
                        })
                    }
                },
            }
        )
    }

    return (
        <Dialog
            open={user?.mustChangePassword ?? false}
            onOpenChange={() => {}}
        >
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle>Passwort ändern</DialogTitle>
                    <DialogDescription>
                        Du musst dein Passwort ändern, bevor du fortfahren
                        kannst.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Aktuelles Passwort</Label>
                        <Input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Neues Passwort</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Neues Passwort bestätigen</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleChangePassword}
                        disabled={isPending}
                    >
                        {isPending
                            ? "Wird gespeichert..."
                            : "Passwort speichern"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
