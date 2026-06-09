import { Badge } from "@/components/ui/badge"

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
}

export function VendorStatusBadge({
    vendorConnectionState,
}: {
    vendorConnectionState: string
}) {
    const current =
        statusConfig[vendorConnectionState as keyof typeof statusConfig] || {
            label: vendorConnectionState || "Unknown",
            dotColor: "bg-gray-400",
            pingColor: "bg-gray-300",
            badgeClass:
                "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/10",
        }

    return (
        <Badge
            variant="outline"
            className={`inline-flex items-center gap-2 font-medium px-2.5 py-0.5 rounded-full ${current.badgeClass}`}
        >
            <span className="relative flex h-2 w-2">
                <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pingColor}`}
                ></span>
                <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`}
                ></span>
            </span>
            {current.label}
        </Badge>
    )
}
