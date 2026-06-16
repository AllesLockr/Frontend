import type { ReactNode } from "react"
import type { GetVendorDataResponseDto } from "@/client"

export interface VendorLockStep {
    label: string
    content: ReactNode
    // Optional gate run before advancing to the next step. Reject to prevent
    // the wizard from advancing.
    onNext?: () => Promise<void>
}

export interface VendorLockStepsResult {
    steps: VendorLockStep[]
    isLoading: boolean
}

export type UseVendorLockSteps = (
    vendorData: GetVendorDataResponseDto,
) => VendorLockStepsResult
