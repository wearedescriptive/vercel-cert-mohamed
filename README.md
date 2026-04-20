# Vercel Swag Store

An e-commerce storefront built with Next.js 16, managed as a pnpm + Turborepo monorepo.

## Monorepo Structure

```
swag-store/
├── apps/
│   └── web/                  # Next.js 16 storefront
├── packages/
│   ├── ui/                   # @repo/ui — shared React component library (Radix UI)
│   ├── tailwind-config/      # @repo/tailwind-config — shared theme tokens & animations
│   ├── eslint-config/        # @repo/eslint-config — shared ESLint configurations
│   └── typescript-config/    # @repo/typescript-config — shared tsconfig presets
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Apps

| App   | Description                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------- |
| `web` | Next.js 16 storefront using the App Router, React 19, Tailwind CSS v4, Server Actions, and `"use cache"` |

## Packages

| Package                   | Description                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `@repo/ui`                | Shared React component library (Sheet, Button, etc.) built on Radix UI, clsx, and tailwind-merge |
| `@repo/tailwind-config`   | Shared Tailwind CSS v4 theme (color tokens, typography, animations) consumed via `@import`       |
| `@repo/eslint-config`     | Shared ESLint flat configs — `base`, `next-js`, and `react-internal` presets                     |
| `@repo/typescript-config` | Shared `tsconfig.json` presets extended by all apps and packages                                 |

## Prerequisites

- Node.js >= 18
- pnpm 9

## Getting Started

### Install dependencies

```sh
pnpm install
```

### Set up environment variables

Create `apps/web/.env.local` with:

```
STORE_API_URL=https://your-swag-store-api.vercel.app/api
STORE_API_SECRET=your-bypass-token
```

### Development

Run all apps and packages in dev mode:

```sh
pnpm dev
```

Run only the web app:

```sh
pnpm --filter web dev
```

### Build

Build everything:

```sh
pnpm build
```

Build a specific workspace:

```sh
pnpm --filter web build
```

### Lint & Type Check

```sh
pnpm lint
pnpm check-types
```

## pnpm Workspace Commands

### Add a dependency to a specific workspace

```sh
# Add a production dependency to the web app
pnpm --filter web add <package>

# Add a dev dependency to the ui package
pnpm --filter @repo/ui add -D <package>
```

### Run a script in a specific workspace

```sh
pnpm --filter web dev
pnpm --filter @repo/ui lint
pnpm --filter @repo/eslint-config check-types
```

### Install a workspace package as a dependency

Workspace packages are referenced using the `workspace:*` protocol in `package.json`:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/tailwind-config": "workspace:*"
  }
}
```

## Environment Variables

| Variable           | Description                                                              | Required |
| ------------------ | ------------------------------------------------------------------------ | -------- |
| `STORE_API_URL`    | Base URL of the Swag Store API (including `/api` path)                   | Yes      |
| `STORE_API_SECRET` | Vercel Deployment Protection bypass token (`x-vercel-protection-bypass`) | Yes      |

These are declared as `globalEnv` in `turbo.json` so Turborepo includes them in cache hashing.
