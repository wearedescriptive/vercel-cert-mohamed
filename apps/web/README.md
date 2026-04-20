# Swag Store — Web

The customer-facing storefront for the Vercel Swag Store. A server-rendered e-commerce application built with the Next.js App Router.

## Tech Stack

- **Next.js 16** — App Router, React Server Components, streaming with Suspense
- **React 19** — `useActionState`, `useTransition`, Server Actions
- **Tailwind CSS v4** — utility-first styling with custom theme tokens from `@repo/tailwind-config`
- **`"use cache"` / `cacheLife` / `cacheTag`** — fine-grained server-side caching for product and category data
- **Server Actions** — cart mutations and search queries execute server-side, hiding API details from the client
- **Radix UI** — accessible primitives for the Sheet (cart overlay) via `@repo/ui`

## Routes

| Route              | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `/`                | Home page with a promotional banner and featured products grid                               |
| `/search`          | Search page with text input, category filter, and paginated product results                  |
| `/products/[slug]` | Product detail page with image, pricing, stock indicator, quantity selector, and add-to-cart |

Each route has its own `loading.tsx` skeleton for instant navigation feedback, and product/search data is cached with `"use cache"` for fast repeat visits.

## Key Features

- **Search** — server-action-powered search with debounced auto-search, category filtering, pagination, and URL persistence
- **Cart** — sliding sheet (right on desktop, bottom on mobile) with session-persisted cart state via `sessionStorage` and server actions
- **Caching** — categories cached for hours, product listings cached for minutes, individual products cached with per-product tags (`product-{slug}`)
- **Error Boundaries** — root-level and route-specific `error.tsx` pages with retry actions
- **Not Found** — custom `not-found.tsx` for missing products

## Running Locally

From this directory:

```sh
pnpm dev
```

Or from the monorepo root:

```sh
pnpm --filter web dev
```

The app starts at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in this directory:

```
STORE_API_URL=https://your-swag-store-api.vercel.app/api
STORE_API_SECRET=your-bypass-token
```

| Variable           | Description                                                                           |
| ------------------ | ------------------------------------------------------------------------------------- |
| `STORE_API_URL`    | Base URL of the Swag Store API, including the `/api` path                             |
| `STORE_API_SECRET` | Vercel Deployment Protection bypass token sent as `x-vercel-protection-bypass` header |

## Build

```sh
pnpm build
```

The output is written to `.next/`. Run the production server with:

```sh
pnpm start
```
