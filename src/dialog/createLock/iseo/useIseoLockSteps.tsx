import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
    createLockMutation,
    getVendorSpecificDefinitionsOptions,
    updateLockMutation,
} from "@/client/@tanstack/react-query.gen.ts"
import type { GetVendorDataResponseDto, LockDto } from "@/client"
import type { VendorLockStepsResult } from "@/dialog/createLock/types.ts"
import {
    CredentialsStep,
    type IseoCredential,
} from "@/dialog/createLock/iseo/steps/CredentialsStep.tsx"
import { PairingStep } from "@/dialog/createLock/iseo/steps/PairingStep.tsx"

export function useIseoLockSteps(
    vendorData: GetVendorDataResponseDto,
): VendorLockStepsResult {
    const [createdLock, setCreatedLock] = useState<LockDto | undefined>(
        undefined,
    )

    const { data: definitionsData, isPending } = useQuery(
        getVendorSpecificDefinitionsOptions({
            path: { forVendor: vendorData.forApi },
        }),
    )

    const createMutation = useMutation(createLockMutation())
    const updateMutation = useMutation(updateLockMutation())

    const fields = definitionsData?.vendorSpecificFields ?? []

    const credentials: IseoCredential[] = fields
        .map((field) => {
            const entry = vendorData.metadata?.find((m) => m.key === field.name)
            if (!entry) {
                return null
            }
            return { field, value: entry.value }
        })
        .filter((item): item is IseoCredential => item !== null)

    const facilityName =
        vendorData.baseUrl.match(/^https?:\/\/api-([^.]+)\./)?.[1] ?? ""

    return {
        steps: [
            {
                label: "Credentials",
                content: (
                    <CredentialsStep
                        credentials={credentials}
                        facilityName={facilityName}
                        isPending={isPending}
                    />
                ),
                onNext: async () => {
                    const lock = await createMutation.mutateAsync({
                        path: { forVendor: vendorData.forApi },
                    })
                    setCreatedLock(lock)
                },
            },
            {
                label: "Pairing",
                content: <PairingStep lock={createdLock} />,
                onCreate: async () => {
                    if (!createdLock) {
                        throw new Error(
                            "No lock was created in the previous step.",
                        )
                    }
                    await updateMutation.mutateAsync({
                        path: { id: createdLock.id },
                        body: {
                            name: createdLock.name,
                            serialNumber: createdLock.serialNumber,
                            metadata: createdLock.metadata,
                            apiIdentity: createdLock.apiIdentity,
                        },
                    })
                },
            },
        ],
        isLoading:
            isPending || createMutation.isPending || updateMutation.isPending,
    }
}
