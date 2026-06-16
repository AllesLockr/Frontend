import { Badge } from "@/components/ui/badge"

type AccessStatus = "Scheduled" | "Active" | "Expired"

function getAccessStatus(start: string, end: string): AccessStatus {
    const now = Date.now()
    const startMs = new Date(start).getTime()
    const endMs = new Date(end).getTime()

    if (now < startMs) return "Scheduled"
    if (now > endMs) return "Expired"
    return "Active"
}

const variantByStatus: Record<
    AccessStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    Active: "default",
    Scheduled: "secondary",
    Expired: "outline",
}

export function AccessStatusBadge({
    start,
    end,
}: {
    start: string
    end: string
}) {
    const status = getAccessStatus(start, end)

    return <Badge variant={variantByStatus[status]}>{status}</Badge>
}
