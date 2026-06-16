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
import { getPersonsPagedMutation } from "@/client/@tanstack/react-query.gen.ts"
import { useMutation } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import type { PersonFilterSchema } from "@/client/types.gen.ts"
import { CreatePersonDialog } from "@/dialog/CreatePersonDialog.tsx"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function Persons() {
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const { data, error, mutate, isPending } = useMutation(
        getPersonsPagedMutation()
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    const prevSearchRef = useRef(debouncedSearch)
    const prevSizeRef = useRef(size)

    const fetchPersons = useCallback(
        (pageToFetch: number) => {
            const filter: PersonFilterSchema = debouncedSearch
                ? { search: debouncedSearch }
                : {}
            mutate({ body: { filter, page: pageToFetch, size } })
        },
        [debouncedSearch, size, mutate]
    )

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

        fetchPersons(currentPage)
    }, [page, size, debouncedSearch, fetchPersons])

    const pageInfo = data?.page
    const persons = pageInfo?.content ?? []

    return (
        <div className="flex h-full flex-col gap-4 overflow-hidden">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Persons</h2>
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
                    <CreatePersonDialog onSuccess={() => fetchPersons(page)} />
                </div>
            </section>

            <div className="flex-1 overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Firstname</TableHead>
                            <TableHead>Lastname</TableHead>
                            <TableHead>Email</TableHead>
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
                        ) : persons.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-muted-foreground"
                                >
                                    No persons found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            persons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>{person.firstname}</TableCell>
                                    <TableCell>{person.lastname}</TableCell>
                                    <TableCell>{person.email}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
