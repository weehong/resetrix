# Resetrix API

HTTP API for Resetrix — **Express 5**, **TypeScript**, **Prisma** (PostgreSQL),
**pino**, **zod**, and OpenAPI/Swagger.

Part of the Resetrix repo (`api/` sibling of `app/` and `web/`).

## Overview

- **Express 5** with native async error propagation (handlers just `throw`).
- **TypeScript** in strict mode with the `@/*` path alias.
- **Prisma** ORM targeting **PostgreSQL**.
- **zod** for fail-fast environment validation and request validation.
- **pino** + **pino-http** for structured, per-request logging.
- **helmet**, **cors**, **compression**, and **express-rate-limit** by default.
- **OpenAPI** generated from zod schemas and served via **Swagger UI** at `/docs`.
- **Vitest** (unit) + **supertest** (integration) + **Playwright** (e2e).
- Graceful shutdown on `SIGTERM`/`SIGINT` with Prisma disconnect.

## Requirements

- Node.js **22+**
- npm
- PostgreSQL 16+ (a local instance is provided via `docker compose`)
- Docker (optional, for containerized builds)

## Getting Started

```sh
npm install
npm run setup           # playwright browsers for e2e
cp .env.example .env     # then adjust values as needed

# Postgres is not published in the base compose file; the dev override binds
# it to 127.0.0.1:5432 for local Prisma/migrate access.
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
npm run db:migrate       # create the schema

npm run dev              # loads .env via --env-file; http://localhost:3000
```

If port `5432` is already in use, point `DATABASE_URL` in `.env` at that Postgres
instance (and create a `resetrix` database) instead of starting the compose db.
Verify it is up:

- `GET http://localhost:3000/health` → `{ "data": { "status": "ok", ... } }`
- `GET http://localhost:3000/ready` → readiness incl. database check
- `http://localhost:3000/docs` → Swagger UI
- `http://localhost:3000/openapi.json` → raw OpenAPI document

## Environment

Validated at boot by `src/config/env.ts`; invalid values exit the process with a
readable error. Defaults make local development work out of the box.

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development` \| `test` \| `production` |
| `PORT` | `3000` | HTTP listen port |
| `LOG_LEVEL` | `info` | pino level (`fatal`…`trace`) |
| `CORS_ORIGIN` | `http://localhost:5173` | `*` or comma-separated origin list |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window per IP |
| `DATABASE_URL` | local Postgres `resetrix` | Prisma PostgreSQL connection string |

## Important Notes

- **Path alias `@/*`** maps to `src/*`. `tsx` resolves it in development; at build
  time `tsc-alias` rewrites it to relative paths in `dist/`.
- **App-factory / server split:** `createApp()` (in `src/app.ts`) builds the app
  with no open port so integration tests can use `supertest`; `src/server.ts`
  owns listening and graceful shutdown.
- **Express 5 errors:** async handlers may `throw` (e.g. `HttpError`); the
  central error handler catches rejected promises — no wrapper needed.
- **Strict TypeScript & ESLint** are enforced; `npm run lint` runs with
  `--max-warnings 0`. Explicit return types, `import type`, and `Array<T>` required.
- **Prettier formats with tabs** (`endOfLine: lf`). Run `npm run format`.
- **Structured logging only** — use `req.log` / pino, never `console.log`.

## Testing

```sh
npm run test:unit:run       # Vitest: unit + supertest integration (no port)
npm run test:unit:coverage  # with v8 coverage
npm run test:e2e            # Playwright against the built server
```

- **Unit** — pure service/middleware logic (`tests/unit/`).
- **Integration** — full middleware chain via `supertest` against `createApp()`
  (`tests/integration/`).
- **E2E** — Playwright `request` fixture against a started server (`e2e/`).

## Preparing for Deployment

**Without Docker**

```sh
npm run build           # tsc + tsc-alias → dist/
npm run db:deploy       # apply migrations (prisma migrate deploy)
npm run start           # node dist/server.js
```

**With Docker**

```sh
docker build -t resetrix-api .
docker run -p 3000:3000 --env-file .env resetrix-api
```

**With Docker Compose (API + PostgreSQL)**

```sh
docker compose up --build
```

**CI baseline:**

```sh
npm run lint
npm run typecheck
npm run test:unit:run
npm run build
```

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Run the server with hot reload (tsx watch) |
| `build` | Type-check + emit to dist/, rewrite aliases |
| `start` | Run the built server |
| `typecheck` | `tsc --noEmit` |
| `format` | Prettier write over src, tests, e2e |
| `lint` / `lint:fix` | ESLint (`--max-warnings 0`) |
| `test` | Unit + integration + e2e |
| `test:unit` / `test:unit:run` | Vitest watch / single run |
| `test:unit:coverage` | Vitest with coverage |
| `test:e2e` / `test:e2e:report` | Playwright run / open report |
| `db:generate` | prisma generate |
| `db:migrate` / `db:deploy` | Apply migrations (dev / prod) |
| `db:studio` | Prisma Studio |
| `setup` | Install Playwright browsers |

## Project Structure

```text
src/
├── app.ts                 # createApp(): Application — middleware + routes (no listen)
├── server.ts              # bootstrap, listen, graceful shutdown
├── config/                # env (zod, fail-fast) + pino logger
├── lib/                   # prisma singleton, HttpError
├── middlewares/           # error-handler, not-found, validate, request-logger
├── routes/                # routers (health, /api/v1)
├── controllers/           # thin request handlers
├── services/              # pure business logic
├── openapi/               # zod → OpenAPI registry + document
├── types/                 # API envelopes, Express augmentation
└── env.d.ts               # typed process.env
prisma/schema.prisma       # PostgreSQL schema (sample User model)
tests/                     # unit + integration (Vitest + supertest)
e2e/                       # Playwright API tests
```
