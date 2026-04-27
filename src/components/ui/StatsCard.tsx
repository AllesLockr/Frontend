import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
    description: string
    title: string
    icon?: LucideIcon
}

export function StatsCard({ title, description, icon: Icon }: StatsCardProps) {
    return (
        <Card className="@container/card w-full">
            <CardHeader>
                <CardDescription>{description}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex gap-2 items-center">
                    {Icon && <Icon strokeWidth="3.5px" />} {title}
                </CardTitle>
            </CardHeader>
        </Card>
    )
}
