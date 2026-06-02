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
import { getUsersPagedMutation } from "@/client/@tanstack/react-query.gen.ts"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Search, UserRound } from "lucide-react"
import type { UserFilterSchema } from "@/client/types.gen.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { useAuth } from "@/context/AuthContext.tsx"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function Users() {
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const { data, error, mutate, isPending } = useMutation(
        getUsersPagedMutation()
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    const prevSearchRef = useRef(debouncedSearch)
    const prevSizeRef = useRef(size)

    const fetchUsers = (currentPage = page) => {
        const filter: UserFilterSchema = debouncedSearch
            ? { search: debouncedSearch }
            : {}
        mutate({ body: { filter, page: currentPage, size } })
    }

    useEffect(() => {
        let currentPage = page

        if (
            debouncedSearch !== prevSearchRef.current ||
            size !== prevSizeRef.current
        ) {
            currentPage = 0
            setPage(0)
            prevSearchRef.current = debouncedSearch
            prevSizeRef.current = size
        }

        fetchUsers(currentPage)
    }, [page, size, debouncedSearch])

    const { user: currentUser } = useAuth()

    const pageInfo = data?.page
    const users = pageInfo?.content ?? []

    return (
        <div className="space-y-4">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Users</h2>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Firstname</TableHead>
                        <TableHead>Lastname</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Is Active</TableHead>
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
                                Failed to load persons. Please try again.
                            </TableCell>
                        </TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-center text-muted-foreground"
                            >
                                No persons found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstname}</TableCell>
                                <TableCell>{user.lastname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    {user.username}
                                    {user.id === currentUser?.id && (
                                        <UserRound
                                            className="h-4 w-4"
                                            aria-label="This is you"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge>{user?.role ?? "N/A"}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.isActive
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
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
                            ? `${pageInfo.totalElements} total persons`
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
