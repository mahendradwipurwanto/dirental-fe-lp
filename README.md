# rental-web

Public storefront for the rental platform: the shared landing page at `/` plus one path-based storefront per
tenant at `/{slug}`. Next.js 16 App Router with Cache Components, React 19, Tailwind v4, shadcn/ui (Base UI).

This app never touches the database. It reads from `rental-api` over HTTP and generates its types from the
API's OpenAPI document.

## Routes

| Path | What |
|---|---|
| `/` | Marketing landing page for rental owners (own link, page builder, bank-transfer flow, FAQ); `/lp` redirects here |
| `/browse` | Directory of active storefronts with search; entry point for customers |
| `/search?q=` | Directory search |
| `/{slug}` | Storefront home: the `home` page of the published config, rendered block by block |
| `/{slug}/items`, `/{slug}/items/{itemSlug}` | Catalog and item detail with the booking widget |
| `/{slug}/checkout?item&start&end&qty&fulfillment` | Guest checkout (server re-quotes, Server Action creates the booking) |
| `/{slug}/booking/{code}?token=` | Booking status: bank details, countdown, receipt upload, cancel |
| `/{slug}/p/{page}` | Custom pages from the published config (blocks) |
| `/{slug}/preview?token=&page=` | Draft renderer for the builder iframe (noindex, no-store); relays clicks and accepts highlight/refresh messages |
| `POST /api/revalidate` | Called by the API with `Authorization: Bearer REVALIDATE_SECRET` and `{ tags }` |
| `/api/storefront/*` | Rewrite to the API's `/v1/public/*` for browser-side quotes and availability |

## Local development

```bash
cp .env.example .env.local
pnpm install
pnpm gen:api        # types from ../rental-api/public/openapi.json
pnpm sync:schema    # vendored site-config schema from rental-api
pnpm dev            # http://localhost:3000 (API expected on :4000)
```

## Blocks

`src/components/storefront/BlockRenderer.tsx` applies each block's shared style (background band, padding,
width, alignment) and dispatches to `src/components/blocks/*` by type. Unknown or invalid blocks are skipped in
production and shown as an error box in preview. `columns` renders its children in compact mode.

## Caching

Tenant data is fetched inside `'use cache'` functions in `src/lib/api/storefront.ts` tagged with
`tenant:{slug}`, `tenant:{slug}:listings`, `listing:{slug}:{itemSlug}` and `directory`. The API purges tags
through `/api/revalidate` whenever an owner publishes or edits. Checkout, booking status and preview are
never cached.

## Scripts

`pnpm dev`, `pnpm build`, `pnpm start`, `pnpm typecheck`, `pnpm lint`, `pnpm gen:api`, `pnpm sync:schema`,
`pnpm check:schema` (CI: fails if the vendored schema drifted from rental-api).

## Deploy

One Vercel project pointed at this folder. Set `API_URL`, `WEB_API_KEY`, `REVALIDATE_SECRET`, `ADMIN_URL`,
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADMIN_ORIGIN`, and optionally `NEXT_PUBLIC_PLATFORM_NAME` (brand name shown on
platform pages). Region `sin1` to sit next to the API.

## Design system

Platform pages use Plus Jakarta Sans and the tokens in `src/app/globals.css` (ink `#14302B`, sage `#F7F8F5`, teal
`#0F766E`, marigold `#F2B33D`). The recurring motif is a punched rental hang-tag (`.tag-punched`), used for the store
link on `/`, item counts in the directory, and prices on storefront cards (in the tenant's secondary colour).
Storefronts keep the owner's own colours and font; only typography scale and spacing are shared.
