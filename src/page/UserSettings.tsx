import { useAuth } from "@/context/AuthContext.tsx"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation } from "@tanstack/react-query"
import { resetPasswordMutation } from "@/client/@tanstack/react-query.gen.ts"
import { toast } from "sonner"
import type { ErrorResponse } from "@/client"

export function UserSettings() {
    const { user, updateToken } = useAuth()
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
            {
                body: {
                    oldPassword,
                    newPassword,
                },
            },
            {
                onSuccess: (data) => {
                    updateToken(data.jwtToken)
                    handleCancel()
                    toast.success("Password changed", {
                        description:
                            "Your password has been updated successfully.",
                    })
                },
                onError: (error: ErrorResponse) => {
                    const status = error?.status

                    if (status === 401) {
                        toast.error("Failed to change password", {
                            description:
                                "The current password you entered is incorrect.",
                        })
                    } else {
                        toast.error("Failed to change password", {
                            description:
                                error.message ??
                                "Something went wrong. Please try again.",
                        })
                    }
                },
            }
        )
    }

    const handleCancel = () => {
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }

    return (
        <div className="max-w-lg space-y-6">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Settings</h2>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {[
                        { label: "First name", value: user?.firstname },
                        { label: "Last name", value: user?.lastname },
                        { label: "Username", value: user?.username },
                        { label: "Email", value: user?.email },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex items-center justify-between py-2 text-sm"
                        >
                            <span className="text-muted-foreground">
                                {label}
                            </span>
                            <span className="font-medium">{value ?? "–"}</span>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between py-2 text-sm">
                        <span className="text-muted-foreground">Role</span>
                        <Badge variant="secondary">{user?.role ?? "–"}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                            variant={user?.isActive ? "default" : "destructive"}
                        >
                            {user?.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : "Save password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
