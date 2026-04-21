import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext.tsx"
import { Card } from "@/components/ui/card.tsx"

export function UserLogin() {
  const { login, isLoading } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-sm p-8">
      <form onSubmit={handleSubmit}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <div className="mb-2 min-h-12">
            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Einloggen..." : "Einloggen"}
          </Button>
        </FieldGroup>
      </form>
    </Card>
  )
}
