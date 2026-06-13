import { StatsCard } from "@/components/ui/StatsCard.tsx"
import { Building, Key, Lock, MapPin, User } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { getAllAuditLogsPaged, getLocksCount, getPersonsCount } from "@/client"
import { useQuery } from "@tanstack/react-query"
import type { GetAllAuditLogsPagedRequestDto } from "@/client"
import { Username } from "./AuditLogs"
import { formatDate } from "@/lib/utils"
import { VendorStatusBadge } from "@/components/VendorStatusBadge"
import { getAllVendorDataOptions } from "@/client/@tanstack/react-query.gen.ts"

export function Dashboard() {
    const { data: personCount } = useQuery({
        queryKey: ['personsCount'],
        queryFn: () => getPersonsCount(),
    });

    const { data: locksCount } = useQuery({
        queryKey: ['locksCount'],
        queryFn: () => getLocksCount(),
    });

    const { data: auditLogs, isLoading: auditLogsIsLoading, isError: auditLogsHasError, error: auditLogsError } = useQuery({
        queryKey: ['auditLogs'],
        queryFn: () => getAllAuditLogsPaged({ body: { page: 0, size: 10 } as GetAllAuditLogsPagedRequestDto })
    })

    const { data: vendors, isLoading: vendorsIsLoading, isError: vendorsHasError, error: vendorsDataError } = useQuery(getAllVendorDataOptions())

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-8 max-md:flex-col">
                <StatsCard title={locksCount?.data?.count?.toString() ?? "N/A"} description="Locks" icon={Lock} />
                <StatsCard title="TODO" description="Keys" icon={Key} />
                <StatsCard title={personCount?.data?.count?.toString() ?? "N/A"} description="Persons" icon={User} />
                <StatsCard title="TODO" description="Buildings" icon={Building} />
                <StatsCard title="TODO" description="Zones" icon={MapPin} />
            </div>

            <h1 className="text-xl font-bold">Vendor-Overview</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Last connection</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendorsIsLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : vendorsHasError || !vendors ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center font-medium text-red-600"
                            >
                                {vendorsDataError instanceof Error ? vendorsDataError.message : 'An unknown error occurred.'}
                            </TableCell>
                        </TableRow>
                    ) : vendors.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No vendors configured.
                            </TableCell>
                        </TableRow>
                    ) : (
                        vendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                                <TableCell><VendorStatusBadge vendorConnectionState={vendor.vendorConnectionState} /></TableCell>
                                <TableCell>{vendor.forApi}</TableCell>
                                <TableCell>{formatDate(vendor.lastChecked)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <h1 className="text-xl font-bold">Recent Logs</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Performed by</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {auditLogsIsLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : auditLogsHasError || !auditLogs?.data?.page?.content ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center font-medium text-red-600"
                            >
                                {auditLogsError instanceof Error ? auditLogsError.message : 'An unknown error occurred.'}
                            </TableCell>
                        </TableRow>
                    ) : auditLogs.data.page.content.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No audit logs available.
                            </TableCell>
                        </TableRow>
                    ) : (
                        auditLogs.data.page.content.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{formatDate(log.createdAt)}</TableCell>
                                <TableCell>{log.message}</TableCell>
                                <TableCell><Username userId={log.performedByUserId} /></TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
