// Base URL for all API requests. Falls back to relative path in production.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"

// Helper to build full URLs safely
export function buildApiUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`
  return `${API_BASE_URL}${normalizedEndpoint}`
}
