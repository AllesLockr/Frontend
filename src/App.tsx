import { UserLogin } from "@/components/UserLogin.tsx"
import { PageLayout } from "@/components/PageLayout.tsx"

export function App() {
  return (
    <PageLayout>
      <div className="flex flex-1 items-center justify-center">
        <UserLogin />
      </div>
    </PageLayout>
  )
}

export default App
