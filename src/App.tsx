import { UserLogin } from "@/page/UserLogin.tsx"
import { Dashboard } from "@/page/Dashboard.tsx"
import { AuthProvider, useAuth } from "@/context/AuthContext.tsx"
import { Navigate, Route, Routes } from "react-router"
import React from "react"
import { Persons } from "@/page/Persons.tsx"
import { PageLayout } from "@/components/PageLayout.tsx"
import { AuditLogs } from "./page/AuditLogs"
import { UserSettings } from "@/page/UserSettings.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { ChangePasswordDialog } from "@/dialog/ChangePasswordDialog.tsx"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <PageLayout>
            <ChangePasswordDialog />
            {children}
        </PageLayout>
    )
}

export function App() {
    return (
        <AuthProvider>
            <div className="flex h-screen w-screen flex-1 items-center justify-center">
                <Toaster richColors position="top-center"/>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/login" element={<UserLogin />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/persons"
                        element={
                            <ProtectedRoute>
                                <Persons />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/audit-logs"
                        element={
                            <ProtectedRoute>
                                <AuditLogs />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/user-settings"
                        element={
                            <ProtectedRoute>
                                <UserSettings />
                            </ProtectedRoute>
                        }
                    ></Route>
                </Routes>
            </div>
        </AuthProvider>
    )
}

export default App
