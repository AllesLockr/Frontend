import { useQuery } from "@tanstack/react-query"
import { getVendorSpecificDefinitionsOptions } from "@/client/@tanstack/react-query.gen.ts"
import type { GetVendorDataResponseDto } from "@/client"
import type { VendorLockStepsResult } from "@/dialog/createLock/types.ts"
import {
    CredentialsStep,
    type IseoCredential,
} from "@/dialog/createLock/iseo/steps/CredentialsStep.tsx"
import { PairingStep } from "@/dialog/createLock/iseo/steps/PairingStep.tsx"

export function useIseoLockSteps(
    vendorData: GetVendorDataResponseDto,
): VendorLockStepsResult {
    const { data: definitionsData, isPending } = useQuery(
        getVendorSpecificDefinitionsOptions({
            path: { forVendor: vendorData.forApi },
        }),
    )

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

    return {
        steps: [
            {
                label: "Credentials",
                content: (
                    <CredentialsStep
                        credentials={credentials}
                        isPending={isPending}
                    />
                ),
            },
            {
                label: "Pairing",
                content: <PairingStep />,
            },
        ],
        isLoading: isPending,
    }
}
