import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function UserLogin() {
  return (
    <form className="w-full max-w-sm">
      <div className="mb-6 flex items-center justify-center gap-2">
        <Lock className="h-6 w-6" />
        <h1 className="text-2xl font-bold">AllesLocker</h1>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name" className="sr-only">
            Benutzername
          </FieldLabel>
          <Input
            id="form-name"
            type="text"
            placeholder="Benutzername"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-password" className="sr-only">
            Passwort
          </FieldLabel>
          <Input
            id="form-password"
            type="password"
            placeholder="Passwort"
            required
          />
        </Field>
        <Button type="submit">Einloggen</Button>
      </FieldGroup>
    </form>
  )
}
