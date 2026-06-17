import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import { useMutation } from "@tanstack/react-query"
import { deletePersonMutation } from "@/client/@tanstack/react-query.gen.ts"
import { toast } from "sonner"
import type { ErrorResponse, PersonSchema } from "@/client"
import { Trash2 } from "lucide-react"

interface PersonDetailProps {
    person: PersonSchema | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onRefresh: () => void
}

export function PersonDetail({
    person,
    open,
    onOpenChange,
    onRefresh,
}: PersonDetailProps) {
    const { mutate: deletePerson, isPending: isDeletePending } = useMutation(
        deletePersonMutation()
    )

    const handleDelete = () => {
        if (!person) return
        deletePerson(
            { body: { id: person.id } },
            {
                onSuccess: () => {
                    toast.success("Person deleted")
                    onOpenChange(false)
                    onRefresh()
                },
                onError: (err: ErrorResponse) => {
                    toast.error("Failed to delete person", {
                        description: err.message ?? "Please try again.",
                    })
                },
            }
        )
    }

    if (!person) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-md">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-lg">Person Details</SheetTitle>
                    <SheetDescription>
                        {`${person.firstname} ${person.lastname}`.trim() ||
                            person.email}
                    </SheetDescription>
                </SheetHeader>

                {/* Profile Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Profile
                    </h3>
                    <div className="space-y-0">
                        {[
                            { label: "First name", value: person.firstname },
                            { label: "Last name", value: person.lastname },
                            { label: "Email", value: person.email },
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
                    </div>
                </section>

                <Separator className="my-6" />

                {/* API Identities Section */}
                <section className="space-y-3">
                    <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        API Identities
                    </h3>
                    {person.apiIdentities.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No API identities linked.
                        </p>
                    ) : (
                        <div className="space-y-0">
                            {person.apiIdentities.map((identity) => (
                                <div
                                    key={`${identity.api}-${identity.externalId}`}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <span className="text-muted-foreground">
                                        {identity.api}
                                    </span>
                                    <span className="font-mono font-medium">
                                        {identity.externalId}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <Separator className="my-6" />

                {/* Actions Section */}
                <section className="space-y-3">
                    <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Actions
                    </h3>

                    <div className="flex flex-col gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="justify-start gap-2"
                                    disabled={isDeletePending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete person
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete person?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {`${person.firstname} ${person.lastname}`.trim() ||
                                            person.email}{" "}
                                        will be permanently deleted. This action
                                        cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </section>
            </SheetContent>
        </Sheet>
    )
}
