import { PageLayout } from "@/components/PageLayout.tsx"
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

import { Badge } from "@/components/ui/badge.tsx"

const apiList = [
    {
        route: "https://s10.iloq.com/iloqwsapi/help",
        connectionSuccessful: false,
        lastConnected: new Date(Date.now() - 10 * 120 * 1000).toLocaleString(),
    },
    {
        route: "https://keymaster.com/api/v1",
        connectionSuccessful: true,
        lastConnected: new Date(Date.now() - 10 * 60 * 1000).toLocaleString(),
    },
]

const logList = [
    {
        timestamp: new Date(Date.now()).toLocaleString(),
        message:
            "Changed role of person Max Mustermann from 'Mitarbeiter' to 'Vorgesetzter'",
        performedBy: "Joe Mama",
    },
    {
        timestamp: new Date(Date.now() - 10 * 15 * 1000).toLocaleString(),
        message: "Assigned key 'Schlüssel-007' to person Max Mustermann",
        performedBy: "Joe Mama",
    },
    {
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleString(),
        message: "Created person 'Max Mustermann'",
        performedBy: "Joe Mama",
    },
    {
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleString(),
        message: "Created key 'Schlüssel-007'",
        performedBy: "Anna Schmidt",
    },
    {
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(),
        message: "Assigned lock 'Schloss-A3' to zone 'Serverraum'",
        performedBy: "Anna Schmidt",
    },
    {
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toLocaleString(),
        message: "Created zone 'Serverraum'",
        performedBy: "Thomas Becker",
    },
    {
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
        message: "Removed person 'Lisa Müller' from zone 'Eingang Ost'",
        performedBy: "Thomas Becker",
    },
    {
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(),
        message: "Created person 'Lisa Müller'",
        performedBy: "Anna Schmidt",
    },
    {
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toLocaleString(),
        message: "Deleted lock 'Schloss-B1' from object 'Tresor Raum 201'",
        performedBy: "Joe Mama",
    },
    {
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toLocaleString(),
        message: "Created object 'Tresor Raum 201'",
        performedBy: "Thomas Becker",
    },
]

export function Dashboard() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-8 max-md:flex-col">
                <StatsCard title="52" description="Schlösser" icon={Lock} />
                <StatsCard title="61" description="Schlüssel" icon={Key} />
                <StatsCard title="34" description="Personen" icon={User} />
                <StatsCard title="3" description="Objekte" icon={Building} />
                <StatsCard title="16" description="Zonen" icon={MapPin} />
            </div>

            <h1 className="text-xl font-bold">API-Overview</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>API</TableHead>
                        <TableHead>Last connection</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {apiList.map((api) => (
                        <TableRow key={api.route}>
                            <TableCell>
                                <Badge
                                    className={
                                        api.connectionSuccessful
                                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                    }
                                >
                                    {api.connectionSuccessful
                                        ? "Online"
                                        : "Offline"}
                                </Badge>
                            </TableCell>
                            <TableCell>{api.route}</TableCell>
                            <TableCell>{api.lastConnected}</TableCell>
                        </TableRow>
                    ))}
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
                    {logList.map((log) => (
                        <TableRow key={log.timestamp}>
                            <TableCell>{log.timestamp}</TableCell>
                            <TableCell>{log.message}</TableCell>
                            <TableCell>{log.performedBy}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
