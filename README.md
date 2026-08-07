# Resetrix

Production codebase for Resetrix: marketing site, SPA, and HTTP API.

## Packages

| Path | Role | Stack | Port |
| --- | --- | --- | --- |
| [`web/`](web/) | Marketing / landing site | Static HTML, CSS, vanilla JS | Static (any static server) |
| [`app/`](app/) | Product SPA | Vite, React, TanStack Router/Query, pnpm | `5173` (dev) |
| [`api/`](api/) | HTTP API | Express 5, TypeScript, Prisma, PostgreSQL, npm | `3000` (+ Postgres `5432`) |

There is no monorepo workspace — each package installs and runs independently.

## Quick start

### API (`api/`)

```sh
cd api
npm install
cp .env.example .env
docker compose up -d db
npm run db:migrate
npm run dev
```

- Health: http://localhost:3000/health
- Ready: http://localhost:3000/ready
- Docs: http://localhost:3000/docs

### SPA (`app/`)

```sh
cd app
pnpm install
pnpm dev
```

### Marketing site (`web/`)

Serve the `web/` directory with any static file server (for example
`npx serve web` from the repo root).
