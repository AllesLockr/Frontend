import type { GetVendorDataResponseDto } from "@/client"
import type {
    UseVendorLockSteps,
    VendorLockStepsResult,
} from "@/dialog/createLock/types.ts"
import { useIseoLockSteps } from "@/dialog/createLock/iseo/useIseoLockSteps.tsx"
import { useAssaLockSteps } from "@/dialog/createLock/assa/useAssaLockSteps.tsx"

function useUnsupportedVendorSteps(
    vendorData: GetVendorDataResponseDto,
): VendorLockStepsResult {
    return {
        steps: [
            {
                label: "Configure lock",
                content: (
                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
                        <span className="font-medium">Unsupported vendor</span>
                        <span className="text-sm text-muted-foreground">
                            No lock creation form is available for "
                            {vendorData.forApi}".
                        </span>
                    </div>
                ),
            },
        ],
        isLoading: false,
    }
}

/**
 * Resolves the steps hook for a given vendor. The returned hook MUST be called
 * unconditionally within a component that is remounted (keyed) per vendor, so
 * that exactly one vendor hook runs per mount (Rules of Hooks).
 */
export function resolveVendorStepsHook(forApi: string): UseVendorLockSteps {
    const normalized = forApi.toLowerCase()

    if (normalized.includes("iseo")) {
        return useIseoLockSteps
    }
    if (normalized.includes("assa")) {
        return useAssaLockSteps
    }
    return useUnsupportedVendorSteps
}
