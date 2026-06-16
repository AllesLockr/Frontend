import type { LockDto } from "@/client"

interface PairingStepProps {
    lock?: LockDto
}

export function PairingStep({ lock }: PairingStepProps) {
    return (
        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
            <span className="font-medium">Pair the lock</span>
            <span className="text-sm text-muted-foreground">
                Bring the lock to pairing mode and follow the instructions in
                the installer app.
            </span>
            {lock && (
                <span className="text-xs text-muted-foreground">
                    Alles-Locker Lock-ID: {lock.id}
                </span>
            )}
        </div>
    )
}
