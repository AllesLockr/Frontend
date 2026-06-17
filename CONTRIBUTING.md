# Branching Model

## Naming Guidelines

We use a prefix-based branching model. Please name your branches as follows:

- `feat/` for new features
- `fix/` for bug fixes
- `docs/` for documentation changes
- `refactor/` for code refactoring
- `chore/` for routine tasks

Example: `feat/add-search-bar`

## Workflow

- Pull requests must be peer reviewed by one other contributor.
- Mention the issue / ticket number in the pull request description.
  - Example: `Closes #123`

# Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- **Type**: feat, fix, docs, style, refactor, perf, test, chore.
- **Subject**: Use the imperative mood ("add" not "added"). Max 50 characters.
- **Body**: (Optional) Use it to explain the *why* and *how*, not the *what*.

Example: `feat(locks): add ISEO sync endpoint`

# Dev Setup

### Required tools

- Node.js 22
- pnpm 11.6+

### Commands

```sh
pnpm install         # Install dependencies
pnpm dev             # Start Vite dev server on :5173
pnpm lint            # ESLint check
pnpm typecheck       # TypeScript type check
pnpm format          # Prettier format
pnpm build           # Typecheck + production build
```
