import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllVendorData } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { CreateVendorDataDialog } from "@/dialog/CreateVendorDataDialog.tsx"

export function VendorStatusBadge({
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

export function Vendors() {
    const queryClient = useQueryClient()
    const { data, error, isPending } = useQuery({
        queryKey: ["vendors"],
        queryFn: () => getAllVendorData(),
    })

    const vendors = data?.data ?? []

    return (
        <div className="space-y-4">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Vendors</h2>
                <div className="flex items-center gap-2">
                    <CreateVendorDataDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["vendors"] })} />
                </div>
            </section>


            {isPending ? (
                <div className="text-center text-muted-foreground py-10">Loading...</div>
            ) : error ? (
                <div className="text-center text-destructive py-10">
                    Failed to load vendor data. Please try again.
                </div>
            ) : vendors.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">No vendors configured.</div>
            ) : (
                <div className="grid gap-4">
                    {vendors.map((vendor) => (
                        <Card key={vendor.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle>{vendor.forApi}</CardTitle>
                                    <VendorStatusBadge vendorConnectionState={vendor.vendorConnectionState} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    Last checked: {formatDate(vendor.lastChecked)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
