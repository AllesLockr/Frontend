interface CreateAssaAmockLockProps {
    vendor: string
}

export function CreateAssaAmockLock({ vendor }: CreateAssaAmockLockProps) {
    return (
        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
            <span className="font-medium">ASSA ABLOY lock</span>
            <span className="text-sm text-muted-foreground">
                The form to create an ASSA ABLOY lock for "{vendor}" is not
                implemented yet.
            </span>
        </div>
    )
}
