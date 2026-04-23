interface DashboardProps {
  message: string
}

export function Dashboard({ message }: DashboardProps) {
  return <h1>{message}</h1>
}
