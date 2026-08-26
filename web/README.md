# Resetrix marketing site (`web/`)

Next.js App Router marketing / landing site for Resetrix.

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment](#environment)
- [Important Notes](#important-notes)
- [Testing](#testing)
- [Preparing for Deployment](#preparing-for-deployment)
- [Storybook](#storybook)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Scaffold Prompt](#scaffold-prompt)
- [Installed Packages](#installed-packages)

## Overview

Built with type safety, SEO, deployment readiness, and developer experience in
mind. Based on a batteries-included Next.js template for App Router projects.

- [Next.js](https://nextjs.org) - React framework with App Router, metadata
  routes, and production build tooling
- [React](https://react.dev) - Component-based UI library
- [TypeScript](https://www.typescriptlang.org) - Static types for JavaScript
- [Tailwind CSS](https://tailwindcss.com) - Utility-first styling
- [TanStack Query](https://tanstack.com/query/latest) - Declarative async state
  management for client components
- [Storybook](https://storybook.js.org) - Isolated component development and
  documentation
- [Vitest](https://vitest.dev) - Unit and component test runner
- [Testing Library](https://testing-library.com) - User-focused React testing
- [Playwright](https://playwright.dev) - End-to-end browser testing
- [ESLint](https://eslint.org) - Static code analysis
- [Prettier](https://prettier.io) - Opinionated code formatting
- [Docker](https://www.docker.com) - Containerized standalone Next.js runtime

The app also includes central SEO configuration, metadata routes, app icons,
Open Graph and Twitter images, JSON-LD helpers, robots, sitemap, and safe
non-production indexing defaults.

## Requirements

- [Node.js 22+](https://nodejs.org/en)
- npm
- [Docker](https://www.docker.com), optional for container builds

## Getting Started

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npm run setup
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser. Port
`3001` avoids colliding with the API on `3000`.

## Environment

The canonical production origin is configured once at build time:

```bash
SITE_ORIGIN=https://resetrix.com
APP_ENVIRONMENT=development
```

`SITE_ORIGIN` must be an HTTPS origin with no trailing slash. It is used for
canonicals, sitemap output, social metadata, robots, and structured data. The
repository-confirmed public origin `https://resetrix.com` is the default.
`APP_ENVIRONMENT` controls indexing: only `production` allows search engines to
index the site. Next production builds default to `production`; set this value
explicitly to `preview` or `staging` for non-production deployments.

## Important Notes

1. Brand and SEO defaults live in `lib/site-config.ts`. Update this file before
   shipping a real project so metadata, manifest, robots, sitemap, social
   images, and structured data stay consistent.

2. Non-production deployments emit `noindex, nofollow` and block crawlers
   through `robots.txt`. Set `APP_ENVIRONMENT=production` only for
   the canonical production deployment.

3. The `@/*` path alias maps to the package root. Prefer imports such as
   `@/lib/site-config` over deep relative paths.

4. This project uses strict TypeScript and ESLint rules. Functions and React
   components should declare return types, type-only imports should use
   `import type`, and arrays should use `Array<T>` where lint rules apply.

5. Prettier is configured to use tabs. Run `npm run format` when in doubt.

## Testing

Unit and component tests are handled by Vitest and Testing Library. End-to-end
tests are handled by Playwright.

Run all tests:

```bash
npm run test
```

Run unit tests once:

```bash
npm run test:unit:run
```

Run unit tests in watch mode:

```bash
npm run test:unit
```

Run unit tests with coverage:

```bash
npm run test:unit:coverage
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Open the Playwright report:

```bash
npm run test:e2e:report
```

## Preparing for Deployment

### Without Docker

Build the production app:

```bash
npm run build
npm run verify:seo
```

Start the production server:

```bash
npm run start
```

### With Docker

Build the image:

```bash
docker build -t resetrix-web .
```

Run the container:

```bash
docker run --rm -p 3001:3000 resetrix-web
```

The Dockerfile uses `output: "standalone"` from `next.config.ts` for a minimal
runtime image. The process inside the container still listens on `3000`; map
host `3001` when running alongside the API.

### Continuous Integration

A CI template is intentionally not included. A practical baseline gate is:

```bash
npm run lint
npm run test:unit:run
npm run build
npm run verify:seo
```

Run `npm run test:e2e` in CI after Playwright browsers are installed and a web
server can be started by the Playwright config.

## Storybook

Start Storybook locally:

```bash
npm run storybook
```

Build Storybook:

```bash
npm run storybook:build
```

Storybook is configured to discover stories and MDX files under `app/` and
`components/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js dev server on port 3001 |
| `npm run build` | Build the production app |
| `npm run verify:seo` | Validate prerendered HTML, crawl files, and structured data |
| `npm run start` | Start the production server on port 3001 |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with automatic fixes |
| `npm run format` | Format source, test, and config files |
| `npm run test` | Run Vitest and Playwright |
| `npm run test:unit` | Run Vitest in watch mode |
| `npm run test:unit:run` | Run Vitest once |
| `npm run test:unit:coverage` | Run Vitest with coverage |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:e2e:report` | Open the Playwright HTML report |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run storybook:build` | Build Storybook |
| `npm run setup` | Install Playwright browsers |

## Project Structure

```text
app/                 app router pages, metadata routes, and providers
components/          shared ui and rendering helpers
lib/                 site config and structured-data utilities
__tests__/           unit and component tests
e2e/                 playwright end-to-end tests
.storybook/          storybook configuration
docs/                local reference documents
```

## Scaffold Prompt

Use `SCAFFOLD.md` when you want an AI coding agent to recreate this boilerplate
in a new empty directory. The prompt documents the parameters, conventions, file
manifest, setup steps, verification gates, and initial commit message.

## Installed Packages

### Base

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)

### State Management

- [TanStack Query](https://tanstack.com/query/latest)

### SEO

- [schema-dts](https://github.com/google/schema-dts)

### Linting And Formatting

- [ESLint](https://eslint.org)
- [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint)
- [typescript-eslint](https://typescript-eslint.io)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier#readme)
- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn#readme)
- [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook#readme)
- [Prettier](https://prettier.io)

### Testing

- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [jsdom](https://github.com/jsdom/jsdom)
- [Playwright](https://playwright.dev)

### Storybook

- [Storybook](https://storybook.js.org)
- [@storybook/nextjs](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [@storybook/addon-docs](https://storybook.js.org/docs/writing-docs)
- [@storybook/addon-links](https://storybook.js.org/docs/essentials/actions)
- [@storybook/addon-themes](https://storybook.js.org/docs/essentials/themes)
