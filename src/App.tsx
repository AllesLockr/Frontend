import { UserLogin } from "@/components/UserLogin"
import { PageLayout } from "@/components/PageLayout"
import { Dashboard } from "@/components/Dashboard"
import { AuthProvider, useAuth } from "@/context/AuthContext.tsx"

// Component that decides which view to show based on auth state
function AuthenticatedApp() {
  const { isAuthenticated } = useAuth()

  // If no valid token, show login screen
  if (!isAuthenticated) {
    return <UserLogin />
  }

  // Otherwise, show the dashboard
  return <Dashboard message="Welcome to your dashboard!" />
}

export function App() {
  return (
    <AuthProvider>
      <PageLayout>
        <div className="flex flex-1 items-center justify-center">
          <AuthenticatedApp />
        </div>
      </PageLayout>
    </AuthProvider>
  )
}

export default App
