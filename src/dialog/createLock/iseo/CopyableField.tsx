import { useState } from "react"
import { Check, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { mapFieldType } from "@/lib/utils"

interface CopyableFieldProps {
    label: string
    description?: string
    value: string
    type: string
}

export function CopyableField({
    label,
    description,
    value,
    type,
}: CopyableFieldProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            // Clipboard not available; ignore.
        }
    }

    return (
        <>
            <Label className="text-right whitespace-nowrap pr-2">
                {label}
                {description && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="ml-1 inline-flex align-middle">
                                    <Info className="h-3 w-3 text-muted-foreground cursor-help shrink-0" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </Label>
            <div className="flex items-center gap-2">
                <Input
                    readOnly
                    type={mapFieldType(type)}
                    value={value}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    aria-label={`Copy ${label}`}
                >
                    {copied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </>
    )
}
