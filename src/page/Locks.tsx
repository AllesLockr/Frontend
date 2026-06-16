import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    getLocksPagedMutation,
    syncLocksMutation,
} from "@/client/@tanstack/react-query.gen.ts"
import { useMutation } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import type { LockSchema } from "@/client/types.gen.ts"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CreateLockDialog } from "@/dialog/CreateLockDialog.tsx"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const MAX_VISIBLE_METADATA = 2

function VendorBadge({ lock }: { lock: LockSchema }) {
    return <Badge variant="secondary">{lock.apiIdentity?.api ?? "Local"}</Badge>
}

function MetadataCell({ lock }: { lock: LockSchema }) {
    if (lock.metadata.length === 0) {
        return <span className="text-muted-foreground">–</span>
    }

    const visible = lock.metadata.slice(0, MAX_VISIBLE_METADATA)
    const hiddenCount = lock.metadata.length - visible.length

    return (
        <div className="flex flex-wrap items-center gap-1">
            {visible.map((entry) => (
                <Badge key={entry.key} variant="outline">
                    {entry.key}: {entry.value}
                </Badge>
            ))}
            {hiddenCount > 0 && (
                <Badge variant="outline">+{hiddenCount} more</Badge>
            )}
        </div>
    )
}

export function Locks() {
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)

    const { data, error, mutate, isPending } = useMutation(
        getLocksPagedMutation()
    )
    const syncMutation = useMutation(syncLocksMutation())

    const fetchLocks = useCallback(
        (currentPage: number) => {
            mutate({ body: { page: currentPage, size } })
        },
        [mutate, size]
    )

    useEffect(() => {
        fetchLocks(page)
    }, [page, fetchLocks])

    const handleSync = async () => {
        try {
            const result = await syncMutation.mutateAsync({})
            toast.success("Sync complete", {
                description: `Synced ${result.synced} ${result.synced === 1 ? "lock" : "locks"}, removed ${result.deleted} stale ${result.deleted === 1 ? "lock" : "locks"}.`,
            })
            if (page === 0) {
                fetchLocks(0)
            } else {
                setPage(0)
            }
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            )
        }
    }

    const pageInfo = data?.page
    const locks = pageInfo?.content ?? []

    const syncButton = (
        <Button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="flex items-center gap-1"
        >
            <RefreshCw
                className={cn(
                    "h-4 w-4",
                    syncMutation.isPending && "animate-spin"
                )}
            />
            <span>
                {syncMutation.isPending ? "Syncing..." : "Sync vendors"}
            </span>
        </Button>
    )

    return (
        <div className="space-y-4">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Locks</h2>
                <div className="flex items-center gap-2">
                    {syncButton}
                    <CreateLockDialog onSuccess={() => fetchLocks(page)} />
                </div>
            </section>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Serial number</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Metadata</TableHead>
                        <TableHead>External ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center text-destructive"
                            >
                                Failed to load locks. Please try again.
                            </TableCell>
                        </TableRow>
                    ) : locks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-12">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <span className="font-medium">
                                        No locks yet
                                    </span>
                                    <span className="text-muted-foreground">
                                        Locks appear here after they are synced
                                        from your vendor systems.
                                    </span>
                                    {syncButton}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        locks.map((lock) => (
                            <TableRow key={lock.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {lock.name}
                                        </span>
                                        <span className="max-w-40 truncate font-mono text-xs text-muted-foreground">
                                            {lock.id}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono">
                                    {lock.serialNumber}
                                </TableCell>
                                <TableCell>
                                    <VendorBadge lock={lock} />
                                </TableCell>
                                <TableCell>
                                    <MetadataCell lock={lock} />
                                </TableCell>
                                <TableCell className="font-mono text-muted-foreground">
                                    {lock.apiIdentity?.externalId ?? "–"}
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
                            ? `${pageInfo.totalElements} total locks`
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
                            isPending ||
                            !!error ||
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
                            isPending || !!error || !pageInfo || pageInfo.isLast
                        }
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
