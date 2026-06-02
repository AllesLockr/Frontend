import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAllAuditLogsPagedMutation } from "@/client/@tanstack/react-query.gen.ts"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import type { AuditLogFilterDto } from "@/client/types.gen.ts"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function AuditLogs() {
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)

    const [performedByUserId, setPerformedByUserId] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")

    const [debouncedPerformedByUserId, setDebouncedPerformedByUserId] = useState("")
    const [debouncedFromDate, setDebouncedFromDate] = useState("")
    const [debouncedToDate, setDebouncedToDate] = useState("")

    const { data, error, mutate, isPending } = useMutation(
        getAllAuditLogsPagedMutation()
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPerformedByUserId(performedByUserId)
            setDebouncedFromDate(fromDate)
            setDebouncedToDate(toDate)
        }, 300)

        return () => clearTimeout(timer)
    }, [performedByUserId, fromDate, toDate])

    const prevFiltersRef = useRef({
        performedByUserId: debouncedPerformedByUserId,
        fromDate: debouncedFromDate,
        toDate: debouncedToDate,
        size,
    })

    const fetchAuditLogs = (currentPage = page) => {
        const filter: AuditLogFilterDto = {}

        if (debouncedPerformedByUserId) {
            filter.performedByUserId = debouncedPerformedByUserId
        }

        if (debouncedFromDate) {
            const date = new Date(`${debouncedFromDate}T00:00:00`)
            filter.fromDate = date.toISOString()
        }

        if (debouncedToDate) {
            const date = new Date(`${debouncedToDate}T23:59:59.999`)
            filter.toDate = date.toISOString()
        }

        mutate({ body: { filter, page: currentPage, size } })
    }


    useEffect(() => {
        let currentPage = page

        const filtersChanged =
            debouncedPerformedByUserId !== prevFiltersRef.current.performedByUserId ||
            debouncedFromDate !== prevFiltersRef.current.fromDate ||
            debouncedToDate !== prevFiltersRef.current.toDate ||
            size !== prevFiltersRef.current.size

        if (filtersChanged) {
            prevFiltersRef.current = {
                performedByUserId: debouncedPerformedByUserId,
                fromDate: debouncedFromDate,
                toDate: debouncedToDate,
                size,
            }
            if (page !== 0) {
                currentPage = 0
                setPage(0)
            }
        }

        fetchAuditLogs(currentPage)
    }, [page, size, debouncedPerformedByUserId, debouncedFromDate, debouncedToDate])

    const pageInfo = data?.page
    const auditLogs = pageInfo?.content ?? []

    return (
        <div className="space-y-4">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold">Audit Logs</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filter by User ID..."
                            className="pl-9"
                            value={performedByUserId}
                            onChange={(e) => setPerformedByUserId(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">From:</span>
                        <Input
                            type="date"
                            className="w-40"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">To:</span>
                        <Input
                            type="date"
                            className="w-40"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Created At</TableHead>
                        <TableHead>Performed By (User ID)</TableHead>
                        <TableHead>Message</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-center text-muted-foreground"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-center text-destructive"
                            >
                                {error.message ? error.message : "An unexpected error occurred."}
                            </TableCell>
                        </TableRow>
                    ) : auditLogs.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-center text-muted-foreground"
                            >
                                No audit logs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        auditLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {log.performedByUserId}
                                </TableCell>
                                <TableCell>{log.message}</TableCell>
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
                        onValueChange={(val) => setSize(Number(val))}
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
                            ? `${pageInfo.totalElements} total audit logs`
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
