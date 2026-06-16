import type { VendorSpecificFieldDto } from "@/client"
import { CopyableField } from "@/dialog/createLock/iseo/CopyableField.tsx"

export interface IseoCredential {
    field: VendorSpecificFieldDto
    value: string
}

interface CredentialsStepProps {
    credentials: IseoCredential[]
    facilityName: string
    isPending: boolean
}

export function CredentialsStep({
    credentials,
    facilityName,
    isPending,
}: CredentialsStepProps) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Please open the "Luckey Tools" App and login with the following
                credentials. When logged in, click on "Next".
            </p>

            {isPending ? (
                <div className="flex min-h-[80px] items-center justify-center text-sm text-muted-foreground">
                    Loading credentials...
                </div>
            ) : credentials.length === 0 ? (
                <div className="flex min-h-[80px] items-center justify-center text-center text-sm text-muted-foreground">
                    No credentials are configured for this vendor.
                </div>
            ) : (
                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <CopyableField
                        label="Facility name"
                        value={facilityName}
                        type="TEXT"
                    />
                    {credentials.map(({ field, value }) => (
                        <CopyableField
                            key={field.name}
                            label={field.name}
                            description={field.description}
                            value={value}
                            type={field.type}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
