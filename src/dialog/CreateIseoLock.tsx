interface CreateIseoLockProps {
    vendor: string
}

export function CreateIseoLock({ vendor }: CreateIseoLockProps) {
    return (
        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
            <span className="font-medium">ISEO lock</span>
            <span className="text-sm text-muted-foreground">
                The form to create an ISEO lock for "{vendor}" is not implemented
                yet.
            </span>
        </div>
    )
}
