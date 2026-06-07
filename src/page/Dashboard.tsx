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

import { getAllAuditLogsPaged, getAllVendorData, getPersonsCount } from "@/client"
import { useQuery } from "@tanstack/react-query"
import type { GetAllAuditLogsPagedRequestDto } from "@/client"
import { Username } from "./AuditLogs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

function VendorStatusBadge({
    vendorConnectionState, }: {
        vendorConnectionState: "CONNECTED" | "DISCONNECTED" | "AUTH_FAILED" | string;
    }) {
    const statusConfig = {
        CONNECTED: {
            label: "Connected",
            dotColor: "bg-emerald-500",
            pingColor: "bg-emerald-400",
            badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10",
        },
        DISCONNECTED: {
            label: "Disconnected",
            dotColor: "bg-slate-500",
            pingColor: "bg-slate-400",
            badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/10",
        },
        AUTH_FAILED: {
            label: "Authorization failed",
            dotColor: "bg-red-500",
            pingColor: "bg-red-400",
            badgeClass: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/10",
        },
    };

    const current = statusConfig[vendorConnectionState as keyof typeof statusConfig] || {
        label: vendorConnectionState || "Unknown",
        dotColor: "bg-gray-400",
        pingColor: "bg-gray-300",
        badgeClass: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/10",
    };

    return (
        <Badge
            variant="outline"
            className={`inline-flex items-center gap-2 font-medium px-2.5 py-0.5 rounded-full ${current.badgeClass}`}
        >
            {/* Pulsierender Kreis */}
            <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pingColor}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`}></span>
            </span>
            {current.label}
        </Badge>
    );
}

export function Dashboard() {
    const { data: personCount } = useQuery({
        queryKey: ['personsCount'],
        queryFn: () => getPersonsCount(),
    });

    const { data: auditLogs, isLoading: auditLogsIsLoading, isError: auditLogsHasError, error: auditLogsError } = useQuery({
        queryKey: ['auditLogs'],
        queryFn: () => getAllAuditLogsPaged({ body: { page: 0, size: 10 } as GetAllAuditLogsPagedRequestDto })
    })

    const { data: vendors, isLoading: vendorsIsLoading, isError: vendorsHasError, error: vendorsDataError } = useQuery({
        queryKey: ['vendors'],
        queryFn: () => getAllVendorData()
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-8 max-md:flex-col">
                <StatsCard title="TODO" description="Locks" icon={Lock} />
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
                    ) : vendorsHasError || !vendors?.data ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center font-medium text-red-600"
                            >
                                {vendorsDataError instanceof Error ? vendorsDataError.message : 'An unknown error occurred.'}
                            </TableCell>
                        </TableRow>
                    ) : vendors.data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No vendors configured.
                            </TableCell>
                        </TableRow>
                    ) : (
                        vendors.data.map((vendor) => (
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
