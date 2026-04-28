import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "http://localhost:8080/v3/api-docs",
  output: {
    path: "src/client",
    format: "prettier",
  },
  plugins: ["@hey-api/client-fetch"],
})