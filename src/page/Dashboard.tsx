import { PageLayout } from "@/components/PageLayout.tsx"
import { StatsCard } from "@/components/ui/StatsCard.tsx"
import { Building, Lock, MapPin, User, Key } from "lucide-react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function Dashboard() {
    const apiList = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        },
    ]

    return (
        <PageLayout>
            <div className="flex-col gap-8">
                <div className="flex max-md:flex-col gap-8">
                    <StatsCard title="52" description="Schlösser" icon={Lock}/>
                    <StatsCard title="61" description="Schlüssel" icon={Key}/>
                    <StatsCard title="34" description="Personen" icon={User}/>
                    <StatsCard title="3" description="Objekte" icon={Building}/>
                    <StatsCard title="16" description="Zonen" icon={MapPin}/>
                </div>
                <h1 className="text-xl font-bold">Status</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">API</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apiList.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </PageLayout>
    )
}
