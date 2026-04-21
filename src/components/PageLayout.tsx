import React from "react"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
