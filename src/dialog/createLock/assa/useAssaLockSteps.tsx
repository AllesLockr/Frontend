import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import {
    createLockMutation,
    updateLockMutation,
} from "@/client/@tanstack/react-query.gen.ts"
import type { GetVendorDataResponseDto } from "@/client"
import type { VendorLockStepsResult } from "@/dialog/createLock/types.ts"
import { NameStep } from "@/dialog/createLock/assa/steps/NameStep.tsx"

export function useAssaLockSteps(
    vendorData: GetVendorDataResponseDto,
): VendorLockStepsResult {
    const [name, setName] = useState("")

    const createMutation = useMutation(createLockMutation())
    const updateMutation = useMutation(updateLockMutation())

    return {
        steps: [
            {
                label: "Configure lock",
                content: <NameStep name={name} onChange={setName} />,
                onCreate: async () => {
                    if (!name.trim())
                        throw new Error("Please enter a name for the lock.")
                    const lock = await createMutation.mutateAsync({
                        path: { forVendor: vendorData.forApi },
                    })
                    await updateMutation.mutateAsync({
                        path: { id: lock.id },
                        body: { name },
                    })
                },
            },
        ],
        isLoading: createMutation.isPending || updateMutation.isPending,
    }
}