# Resetrix App

Product SPA for Resetrix.

## Stack

Vite, React, TypeScript, TanStack Router/Query, Tailwind CSS, i18next, pnpm.

## Setup

```sh
pnpm install
pnpm setup   # installs Playwright browsers (optional, for e2e)
cp .env.example .env
pnpm dev
```

App runs at http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Typecheck and production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm storybook` | Storybook |

## Layout

```text
src/
  common/       Shared types and utilities
  components/   Reusable UI
  features/     Feature modules
  hooks/        Shared hooks
  pages/        Route-level pages
  routes/       TanStack Router file routes
  store/        Global client state
  styles/       Global styles
```
