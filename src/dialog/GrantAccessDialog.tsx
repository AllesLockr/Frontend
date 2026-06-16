import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { grantAccessMutation } from "@/client/@tanstack/react-query.gen.ts"
import type { LockSchema, PersonSchema } from "@/client"

interface GrantAccessDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    persons: PersonSchema[]
    locks: LockSchema[]
    onSuccess: () => void
}

function startOfDay(date: Date) {
    const next = new Date(date)
    next.setHours(0, 0, 0, 0)
    return next
}

function endOfDay(date: Date) {
    const next = new Date(date)
    next.setHours(23, 59, 59, 999)
    return next
}

export function GrantAccessDialog({
    open,
    onOpenChange,
    persons,
    locks,
    onSuccess,
}: GrantAccessDialogProps) {
    const [personId, setPersonId] = useState<string | undefined>(undefined)
    const [lockId, setLockId] = useState<string | undefined>(undefined)
    const [range, setRange] = useState<DateRange | undefined>(undefined)
    const [apiError, setApiError] = useState<string | null>(null)
    const [notProvisioned, setNotProvisioned] = useState(false)

    const { mutateAsync, isPending } = useMutation(grantAccessMutation())

    const resetForm = () => {
        setPersonId(undefined)
        setLockId(undefined)
        setRange(undefined)
        setApiError(null)
        setNotProvisioned(false)
    }

    const closeAndReset = () => {
        resetForm()
        onOpenChange(false)
    }

    const canSubmit = !!personId && !!lockId && !!range?.from && !!range?.to

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setApiError(null)
        setNotProvisioned(false)

        if (!canSubmit) return

        const start = startOfDay(range!.from!)
        const end = endOfDay(range!.to!)

        try {
            await mutateAsync({
                body: {
                    personId: personId!,
                    lockId: lockId!,
                    start: start.toISOString(),
                    end: end.toISOString(),
                },
            })
            closeAndReset()
            onSuccess()
        } catch (error: unknown) {
            const err = error as { status?: number; message?: string }
            if (err?.status === 422) {
                setNotProvisioned(true)
            } else {
                setApiError(err?.message ?? "An unexpected error occurred.")
            }
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) closeAndReset()
            }}
        >
            <DialogContent className="sm:max-w-[460px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Grant access</DialogTitle>
                        <DialogDescription>
                            Give a person access to a lock for a limited time
                            window.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="person" className="text-right">
                                Person
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={personId}
                                    onValueChange={setPersonId}
                                >
                                    <SelectTrigger
                                        id="person"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a person" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {persons.map((person) => (
                                            <SelectItem
                                                key={person.id}
                                                value={person.id}
                                            >
                                                {person.firstname}{" "}
                                                {person.lastname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lock" className="text-right">
                                Lock
                            </Label>
                            <div className="col-span-3">
                                <Select value={lockId} onValueChange={setLockId}>
                                    <SelectTrigger id="lock" className="w-full">
                                        <SelectValue placeholder="Select a lock" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locks.map((lock) => (
                                            <SelectItem
                                                key={lock.id}
                                                value={lock.id}
                                            >
                                                {lock.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Access window</Label>
                            <div className="flex justify-center rounded-md border">
                                <Calendar
                                    mode="range"
                                    selected={range}
                                    onSelect={setRange}
                                    numberOfMonths={1}
                                    fixedWeeks
                                    autoFocus
                                    className="bg-transparent"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {range?.from && range?.to
                                    ? `${format(startOfDay(range.from), "dd.MM.yyyy, HH:mm")} - ${format(endOfDay(range.to), "dd.MM.yyyy, HH:mm")}`
                                    : "Pick a start and end day."}
                            </p>
                        </div>
                    </div>

                    {notProvisioned && (
                        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                            This person is not provisioned on the lock's vendor
                            system.
                        </div>
                    )}

                    {apiError && (
                        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                            {apiError}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeAndReset}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!canSubmit || isPending}>
                            {isPending ? "Granting..." : "Grant access"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
