# Branching Model and Commit Message Guidelines
Please refer to the [wiki](https://github.com/AllesLockr/Backend/wiki/Contributing)

# Dev Setup

## Prerequisites

- Node.js 22
- pnpm 11.6+
- Backend running on `http://localhost:8080` (see [Backend README](https://github.com/alleslockr/alleslocker-backend))

## Setup

```sh
pnpm install
pnpm dev
```

The dev server starts on `http://localhost:5173` and proxies `/api` to `http://localhost:8080`.

## Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm lint` | ESLint check |
| `pnpm format` | Prettier format |
| `pnpm typecheck` | TypeScript type check |
| `pnpm openapi-ts` | Regenerate API client from backend OpenAPI spec |

## Project Structure

```
src/
├── main.tsx          # Entry point
├── App.tsx           # Routes
├── client/           # Auto-generated API client (do not edit)
├── components/       # Shared UI components
├── config/           # App configuration (API URL, etc.)
├── dialog/           # Modal overlays
├── hook/             # React hooks (auth, theme, etc.)
└── page/             # Page components
```

## Docker

Multi-stage build:
1. **Builder** — `node:22-alpine`, installs dependencies, runs `pnpm build`
2. **Runtime** — `nginx:alpine`, serves the built static files on port 80

Build manually:

```sh
docker build -t alleslocker-frontend:latest .
```
