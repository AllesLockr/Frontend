import type { ReactNode } from "react"
import type { GetVendorDataResponseDto } from "@/client"

export interface VendorLockStep {
    label: string
    content: ReactNode
}

export interface VendorLockStepsResult {
    steps: VendorLockStep[]
    isLoading: boolean
}

export type UseVendorLockSteps = (
    vendorData: GetVendorDataResponseDto,
) => VendorLockStepsResult
