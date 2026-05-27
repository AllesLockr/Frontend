import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <StrictMode>
            <QueryClientProvider client={new QueryClient()}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>
    </BrowserRouter>
)
