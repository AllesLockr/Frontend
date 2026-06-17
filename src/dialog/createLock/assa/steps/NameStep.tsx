import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NameStepProps {
    name: string
    onChange: (value: string) => void
}

export function NameStep({ name, onChange }: NameStepProps) {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lock-name" className="text-right">
                Name
            </Label>
            <Input
                id="lock-name"
                className="col-span-3"
                value={name}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter lock name"
            />
        </div>
    )
}