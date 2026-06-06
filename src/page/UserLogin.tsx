import { Button } from "@/components/ui/button.tsx"
import { Lock } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import React, { useState } from "react"
import { useAuth } from "@/context/AuthContext.tsx"
import { Card } from "@/components/ui/card.tsx"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function UserLogin() {
    const { login, isLoading } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(username, password)
            navigate("/dashboard")
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred"
            toast.error("Login failed", {
                description: errorMessage,
            })
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
                            Username
                        </FieldLabel>
                        <Input
                            id="form-name"
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="form-password" className="sr-only">
                            Password
                        </FieldLabel>
                        <Input
                            id="form-password"
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </FieldGroup>
            </form>
        </Card>
    )
}