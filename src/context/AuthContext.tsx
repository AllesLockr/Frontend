import React, { createContext, useCallback, useContext, useState } from "react"
import { login as loginRequest } from "@/client"
import { client } from "@/client/client.gen.ts"

interface AuthContextType {
    isAuthenticated: boolean
    token: string | null
    userId: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        const stored = localStorage.getItem("auth_token")
        if (stored) {
            client.setConfig({ headers: { Authorization: `Bearer ${stored}` } }) // ← sofort setzen
        }
        return stored
    })

    const [userId, setUserId] = useState<string | null>(() =>
        localStorage.getItem("user_id")
    )
    const [isLoading, setIsLoading] = useState(false)

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true)
        try {
            const { data, error, response } = await loginRequest({
                body: { username, password },
            })

            if (error || !data) {
                throw new Error(getFriendlyErrorMessage(response.status))
            }

            setToken(data.jwtToken)
            setUserId(data.userId)
            client.setConfig({
                headers: { Authorization: `Bearer ${data.jwtToken}` },
            })
            localStorage.setItem("auth_token", data.jwtToken)
            localStorage.setItem("user_id", data.userId)
        } catch (error) {
            console.error("Authentication failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Clear session and remove stored credentials
    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        client.setConfig({ headers: {} })
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_id")
    }, [])

    const isAuthenticated = !!token

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, token, userId, login, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    )
}

function getFriendlyErrorMessage(status: number): string {
    if (status === 404 || status === 400) {
        return "Benutzer oder Passwort falsch. Bitte überprüfen Sie Ihre Eingabe."
    } else {
        return "Fehler im System."
    }
}

// Custom hook for consuming auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
