import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMutation } from "@tanstack/react-query"
import {
    activateUserMutation,
    adminResetPasswordMutation,
    changeRoleMutation,
    deactivateUserMutation,
    editUserMutation,
    requestPasswordChangeMutation,
} from "@/client/@tanstack/react-query.gen.ts"
import { toast } from "sonner"
import { useState } from "react"
import type { ErrorResponse } from "@/client"
import { Check, Copy, KeyRound, Pencil, ShieldAlert, ShieldCheck, UserCheck, UserX } from "lucide-react"

// Adjust these to match your actual role enum/type
const ROLES = ["ADMIN", "USER"] as const
type Role = (typeof ROLES)[number]

interface User {
    id: string
    firstname?: string
    lastname?: string
    email?: string
    username?: string
    role?: string
    isActive?: boolean
}

interface UserDetailProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onRefresh: () => void
}

export function UserDetail({
    user,
    open,
    onOpenChange,
    onRefresh,
}: UserDetailProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")

    const openEditMode = () => {
        setFirstname(user?.firstname ?? "")
        setLastname(user?.lastname ?? "")
        setEmail(user?.email ?? "")
        setIsEditing(true)
    }

    const cancelEdit = () => {
        setIsEditing(false)
    }

    // --- Mutations ---
    const { mutate: editUser, isPending: isEditPending } =
        useMutation(editUserMutation())

    const { mutate: activateUser, isPending: isActivatePending } = useMutation(
        activateUserMutation()
    )

    const { mutate: deactivateUser, isPending: isDeactivatePending } =
        useMutation(deactivateUserMutation())

    const { mutate: requestPasswordChange, isPending: isResetPending } =
        useMutation(requestPasswordChangeMutation())

    const { mutate: changeRole, isPending: isRolePending } =
        useMutation(changeRoleMutation())

    const { mutate: adminResetPassword, isPending: isAdminResetPending } =
        useMutation(adminResetPasswordMutation())

    const [resetPasswordResult, setResetPasswordResult] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const isBusy =
        isEditPending ||
        isActivatePending ||
        isDeactivatePending ||
        isResetPending ||
        isRolePending ||
        isAdminResetPending

    // --- Handlers ---
    const handleSaveEdit = () => {
        if (!user) return
        editUser(
            {
                body: { userId: user.id, firstname, lastname, email },
            },
            {
                onSuccess: () => {
                    toast.success("User updated")
                    setIsEditing(false)
                    onRefresh()
                },
                onError: (err: ErrorResponse) => {
                    toast.error("Failed to update user", {
                        description: err.message ?? "Please try again.",
                    })
                },
            }
        )
    }

    const handleToggleActive = () => {
        if (!user) return
        if (user.isActive) {
            deactivateUser(
                { body: { userId: user.id } },
                {
                    onSuccess: () => {
                        toast.success("User deactivated")
                        onRefresh()
                    },
                    onError: (err: ErrorResponse) => {
                        toast.error("Failed to deactivate user", {
                            description: err.message ?? "Please try again.",
                        })
                    },
                }
            )
        } else {
            activateUser(
                { body: { userId: user.id } },
                {
                    onSuccess: () => {
                        toast.success("User activated")
                        onRefresh()
                    },
                    onError: (err: ErrorResponse) => {
                        toast.error("Failed to activate user", {
                            description: err.message ?? "Please try again.",
                        })
                    },
                }
            )
        }
    }

    const handleRequestPasswordReset = () => {
        if (!user) return
        requestPasswordChange(
            { body: { userId: user.id } },
            {
                onSuccess: () => {
                    toast.success("Password reset requested", {
                        description:
                            "The user will be prompted to set a new password on next login.",
                    })
                },
                onError: (err: ErrorResponse) => {
                    toast.error("Failed to request password reset", {
                        description: err.message ?? "Please try again.",
                    })
                },
            }
        )
    }

    const handleAdminResetPassword = () => {
        if (!user) return
        adminResetPassword(
            { body: { userId: user.id } },
            {
                onSuccess: (data) => {
                    setResetPasswordResult(data.password)
                    onRefresh()
                },
                onError: (err: ErrorResponse) => {
                    toast.error("Failed to reset password", {
                        description: err.message ?? "Please try again.",
                    })
                },
            }
        )
    }

    const handleCopyPassword = async () => {
        if (!resetPasswordResult) return
        try {
            await navigator.clipboard.writeText(resetPasswordResult)
            setCopied(true)
            toast.success("Password copied to clipboard")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error("Failed to copy password")
        }
    }

    const handleRoleChange = (newRole: string) => {
        if (!user || newRole === user.role) return
        changeRole(
            { body: { userId: user.id, role: newRole as Role } },
            {
                onSuccess: () => {
                    toast.success(`Role changed to ${newRole}`)
                    onRefresh()
                },
                onError: (err: ErrorResponse) => {
                    toast.error("Failed to change role", {
                        description: err.message ?? "Please try again.",
                    })
                },
            }
        )
    }

    if (!user) return null

    return (
        <Sheet
            open={open}
            onOpenChange={(val) => {
                if (!val) setIsEditing(false)
                onOpenChange(val)
            }}
        >
            <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-md">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-lg">User Details</SheetTitle>
                    <SheetDescription>
                        {user.username ?? user.email}
                    </SheetDescription>
                </SheetHeader>

                {/* Profile Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                            Profile
                        </h3>
                        {!isEditing && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openEditMode}
                                disabled={isBusy}
                            >
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label>First name</Label>
                                <Input
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstname(e.target.value)
                                    }
                                    disabled={isEditPending}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Last name</Label>
                                <Input
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastname(e.target.value)
                                    }
                                    disabled={isEditPending}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isEditPending}
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelEdit}
                                    disabled={isEditPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSaveEdit}
                                    disabled={isEditPending}
                                >
                                    {isEditPending
                                        ? "Saving..."
                                        : "Save changes"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {[
                                {
                                    label: "First name",
                                    value: user.firstname,
                                },
                                { label: "Last name", value: user.lastname },
                                { label: "Email", value: user.email },
                                { label: "Username", value: user.username },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <span className="text-muted-foreground">
                                        {label}
                                    </span>
                                    <span className="font-medium">
                                        {value ?? "–"}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between py-2 text-sm">
                                <span className="text-muted-foreground">
                                    Status
                                </span>
                                <Badge
                                    variant={
                                        user.isActive
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    )}
                </section>

                <Separator className="my-6" />

                {/* Role Section */}
                <section className="space-y-3">
                    <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Role
                    </h3>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <Select
                            value={user.role ?? ""}
                            onValueChange={handleRoleChange}
                            disabled={isBusy}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isRolePending && (
                            <span className="text-xs text-muted-foreground">
                                Saving...
                            </span>
                        )}
                    </div>
                </section>

                <Separator className="my-6" />

                {/* Actions Section */}
                <section className="space-y-3">
                    <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Actions
                    </h3>

                    <div className="flex flex-col gap-2">
                        {/* Activate / Deactivate */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start gap-2"
                                    disabled={isBusy}
                                >
                                    {user.isActive ? (
                                        <>
                                            <UserX className="h-4 w-4" />
                                            Deactivate user
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="h-4 w-4" />
                                            Activate user
                                        </>
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {user.isActive
                                            ? "Deactivate user?"
                                            : "Activate user?"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {user.isActive
                                            ? `${user.firstname ?? user.username} will lose access to the system immediately.`
                                            : `${user.firstname ?? user.username} will regain access to the system.`}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleToggleActive}
                                    >
                                        {user.isActive
                                            ? "Deactivate"
                                            : "Activate"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Request Password Reset */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start gap-2"
                                    disabled={isBusy}
                                >
                                    <KeyRound className="h-4 w-4" />
                                    Request password reset
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Request password reset?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {user.firstname ?? user.username} will
                                        be required to set a new password on
                                        their next login.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleRequestPasswordReset}
                                    >
                                        Request reset
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Admin Password Reset */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start gap-2"
                                    disabled={isBusy}
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    Admin password reset
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Reset password for {user.firstname ?? user.username}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        A new password will be generated and can be copied afterwards.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleAdminResetPassword}
                                    >
                                        Reset password
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </section>

                {/* Password Result Dialog */}
                <Dialog
                    open={resetPasswordResult !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setResetPasswordResult(null)
                            setCopied(false)
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Password reset successful</DialogTitle>
                            <DialogDescription>
                                The new password for {user?.firstname ?? user?.username}. Copy it now. It will not be shown again.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 py-4">
                            <Input
                                value={resetPasswordResult ?? ""}
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
                        <DialogFooter>
                            <Button onClick={() => { setResetPasswordResult(null); setCopied(false) }}>
                                Done
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SheetContent>
        </Sheet>
    )
}
