import type { LockDto } from "@/client"

interface PairingStepProps {
    lock?: LockDto
}

export function PairingStep({ lock }: PairingStepProps) {
    return (
        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
            <span className="font-medium">Pair the lock</span>
            <ol className="text-sm text-muted-foreground list-decimal list-inside text-left">
                <li>Tap on "Smart Lock"</li>
                <li>Tap on "Add new smart lock"</li>
                <li>Tap on the discovered Lock</li>
                <li>Enter a name for the new lock</li>
                <li>Tap on "Finish"</li>
                <li>When the App confirmed the creation, click on "Create Lock"</li>
            </ol>
            {lock && (
                <span className="text-xs text-muted-foreground">
                    Alles-Locker Lock-ID: {lock.id}
                </span>
            )}
        </div>
    )
}
