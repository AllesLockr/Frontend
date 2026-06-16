import { useCallback, useEffect, useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AccessStatusBadge } from "@/components/AccessStatusBadge"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { GrantAccessDialog } from "@/dialog/GrantAccessDialog"
import {
    getAccessGrantsPagedMutation,
    getLocksPagedMutation,
    getPersonsPagedMutation,
    revokeAccessMutation,
} from "@/client/@tanstack/react-query.gen.ts"
import type { AccessGrantSchema } from "@/client"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const LOOKUP_SIZE = 100
const ALL = "all"

function truncateId(id: string) {
    if (id.length <= 12) return id
    return `${id.slice(0, 8)}…${id.slice(-4)}`
}

function formatDateTime(value: string) {
    return format(new Date(value), "dd.MM.yyyy, HH:mm")
}

export function AccessGrants() {
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [personFilter, setPersonFilter] = useState<string>(ALL)
    const [lockFilter, setLockFilter] = useState<string>(ALL)

    const [grantOpen, setGrantOpen] = useState(false)
    const [grantToRevoke, setGrantToRevoke] = useState<AccessGrantSchema | null>(
        null,
    )

    const grants = useMutation(getAccessGrantsPagedMutation())
    const personsQuery = useMutation(getPersonsPagedMutation())
    const locksQuery = useMutation(getLocksPagedMutation())
    const revoke = useMutation(revokeAccessMutation())

    const persons = useMemo(
        () => personsQuery.data?.page.content ?? [],
        [personsQuery.data],
    )
    const locks = useMemo(
        () => locksQuery.data?.page.content ?? [],
        [locksQuery.data],
    )

    const personNames = useMemo(() => {
        const map = new Map<string, string>()
        persons.forEach((p) => map.set(p.id, `${p.firstname} ${p.lastname}`))
        return map
    }, [persons])

    const lockNames = useMemo(() => {
        const map = new Map<string, string>()
        locks.forEach((l) => map.set(l.id, l.name))
        return map
    }, [locks])

    useEffect(() => {
        personsQuery.mutate({ body: { filter: {}, page: 0, size: LOOKUP_SIZE } })
        locksQuery.mutate({ body: { page: 0, size: LOOKUP_SIZE } })
    }, [personsQuery.mutate, locksQuery.mutate])

    const fetchGrants = useCallback(
        (currentPage: number) => {
            grants.mutate({
                body: {
                    page: currentPage,
                    size,
                    personId: personFilter === ALL ? undefined : personFilter,
                    lockId: lockFilter === ALL ? undefined : lockFilter,
                },
            })
        },
        [grants.mutate, size, personFilter, lockFilter],
    )

    useEffect(() => {
        fetchGrants(page)
    }, [page, fetchGrants])

    const pageInfo = grants.data?.page
    const rows = pageInfo?.content ?? []

    const handleRevoke = async () => {
        if (!grantToRevoke) return
        try {
            await revoke.mutateAsync({
                body: { grantId: grantToRevoke.grantId },
            })
            toast.success("Access revoked.")
            setGrantToRevoke(null)
            fetchGrants(page)
        } catch (error: unknown) {
            const err = error as { message?: string }
            toast.error(err?.message ?? "Failed to revoke access.")
        }
    }

    const grantButton = (
        <Button
            className="flex items-center gap-1"
            onClick={() => setGrantOpen(true)}
        >
            <Plus className="h-4 w-4" />
            <span>Grant access</span>
        </Button>
    )

    return (
        <div className="space-y-4">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Access Grants</h2>
                {grantButton}
            </section>

            <div className="flex items-center gap-2">
                <Select
                    value={personFilter}
                    onValueChange={(val) => {
                        setPersonFilter(val)
                        setPage(0)
                    }}
                >
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="All persons" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All persons</SelectItem>
                        {persons.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                                {person.firstname} {person.lastname}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={lockFilter}
                    onValueChange={(val) => {
                        setLockFilter(val)
                        setPage(0)
                    }}
                >
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="All locks" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All locks</SelectItem>
                        {locks.map((lock) => (
                            <SelectItem key={lock.id} value={lock.id}>
                                {lock.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Person</TableHead>
                        <TableHead>Lock</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {grants.isPending ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center text-muted-foreground"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : grants.error ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center text-destructive"
                            >
                                Failed to load access grants. Please try again.
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="py-12">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <p className="font-medium">
                                        No access grants yet.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Grant a person access to a lock to see it
                                        listed here.
                                    </p>
                                    <div className="mt-2">{grantButton}</div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((grant) => (
                            <TableRow key={grant.grantId}>
                                <TableCell>
                                    <div className="font-medium">
                                        {personNames.get(grant.personId) ??
                                            "Unknown"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {truncateId(grant.personId)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        {lockNames.get(grant.lockId) ??
                                            "Unknown"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {truncateId(grant.lockId)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(grant.start)}
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(grant.end)}
                                </TableCell>
                                <TableCell>
                                    <AccessStatusBadge
                                        start={grant.start}
                                        end={grant.end}
                                    />
                                </TableCell>
                                <TableCell>
                                    {grant.vendor ? (
                                        <Badge variant="secondary">
                                            {grant.vendor}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-muted-foreground"
                                        >
                                            Not provisioned
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-destructive"
                                        onClick={() => setGrantToRevoke(grant)}
                                    >
                                        Revoke
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <Select
                        value={String(size)}
                        onValueChange={(val) => {
                            setSize(Number(val))
                            setPage(0)
                        }}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>
                        {pageInfo
                            ? `${pageInfo.totalElements} total access grants`
                            : ""}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Previous page"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={
                            grants.isPending ||
                            !!grants.error ||
                            !pageInfo ||
                            pageInfo.isFirst
                        }
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>
                        Page {page + 1} of {pageInfo?.totalPages ?? "?"}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Next page"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={
                            grants.isPending ||
                            !!grants.error ||
                            !pageInfo ||
                            pageInfo.isLast
                        }
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <GrantAccessDialog
                open={grantOpen}
                onOpenChange={setGrantOpen}
                persons={persons}
                locks={locks}
                onSuccess={() => {
                    toast.success("Access granted.")
                    fetchGrants(page)
                }}
            />

            <ConfirmDialog
                open={!!grantToRevoke}
                onOpenChange={(open) => !open && setGrantToRevoke(null)}
                title="Revoke access?"
                confirmLabel="Revoke"
                confirmVariant="destructive"
                isLoading={revoke.isPending}
                onConfirm={handleRevoke}
                description={
                    grantToRevoke ? (
                        <span className="block space-y-3">
                            <span className="block">
                                This removes the grant from the lock's vendor
                                system. The person will no longer be able to open
                                this lock. This action cannot be undone.
                            </span>
                            <span className="block rounded-md border bg-muted/40 p-3 text-sm text-foreground">
                                <span className="grid grid-cols-[80px_1fr] gap-y-1">
                                    <span className="text-muted-foreground">
                                        Person
                                    </span>
                                    <span className="font-medium">
                                        {personNames.get(
                                            grantToRevoke.personId,
                                        ) ?? "Unknown"}
                                    </span>
                                    <span className="text-muted-foreground">
                                        Lock
                                    </span>
                                    <span className="font-medium">
                                        {lockNames.get(grantToRevoke.lockId) ??
                                            "Unknown"}
                                    </span>
                                    <span className="text-muted-foreground">
                                        Window
                                    </span>
                                    <span className="font-medium">
                                        {formatDateTime(grantToRevoke.start)} —{" "}
                                        {formatDateTime(grantToRevoke.end)}
                                    </span>
                                </span>
                            </span>
                        </span>
                    ) : undefined
                }
            />
        </div>
    )
}
