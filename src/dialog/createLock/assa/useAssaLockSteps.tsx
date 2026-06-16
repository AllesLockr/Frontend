import type { GetVendorDataResponseDto } from "@/client"
import type { VendorLockStepsResult } from "@/dialog/createLock/types.ts"
import { PlaceholderStep } from "@/dialog/createLock/assa/steps/PlaceholderStep.tsx"

export function useAssaLockSteps(
    vendorData: GetVendorDataResponseDto,
): VendorLockStepsResult {
    return {
        steps: [
            {
                label: "Configure lock",
                content: <PlaceholderStep vendor={vendorData.forApi} />,
            },
        ],
        isLoading: false,
    }
}
