import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { CreateVendorDataDialog } from "@/dialog/CreateVendorDataDialog.tsx"
import { VendorStatusBadge } from "@/components/VendorStatusBadge"
import {
    getAllVendorDataOptions,
    getAllVendorDataQueryKey,
} from "@/client/@tanstack/react-query.gen.ts"

export function Vendors() {
    const queryClient = useQueryClient()
    const { data, error, isPending } = useQuery(getAllVendorDataOptions())

    const vendors = data ?? []

    return (
        <div className="space-y-4">
            <section className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Vendors</h2>
                <div className="flex items-center gap-2">
                    <CreateVendorDataDialog
                        onSuccess={() =>
                            queryClient.invalidateQueries({
                                queryKey: getAllVendorDataQueryKey(),
                            })
                        }
                    />
                </div>
            </section>

            {isPending ? (
                <div className="text-center text-muted-foreground py-10">
                    Loading...
                </div>
            ) : error ? (
                <div className="text-center text-destructive py-10">
                    Failed to load vendor data. Please try again.
                </div>
            ) : vendors.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    No vendors configured.
                </div>
            ) : (
                <div className="grid gap-4">
                    {vendors.map((vendor) => (
                        <Card key={vendor.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle>{vendor.forApi}</CardTitle>
                                    <VendorStatusBadge
                                        vendorConnectionState={
                                            vendor.vendorConnectionState
                                        }
                                    />
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
