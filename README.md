# Genius Guides

## Setup

1. Install [Node.js 22+](https://nodejs.org) and [pnpm](https://pnpm.io/installation)
2. Copy `.env.example` to `.env` and fill in values
3. `pnpm install`

## Dev

- `pnpm --filter @workspace/api-server run dev` — API server (port 5000)
- `pnpm --filter @workspace/everydaygenius run dev` — frontend (port 5173)
- `pnpm --filter @workspace/mockup-sandbox run dev` — mockup sandbox (port 5174)

## Other commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Required env vars

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |

## Deploy (Vercel + Render + Supabase)

The frontend (`everydaygenius`) ships to Vercel; the Express API (`api-server`) ships to Render; Postgres runs on Supabase.

### One-time setup on Supabase

1. Create a Supabase project (free tier is fine).
2. In **Project Settings → Database**, copy the **Transaction-mode pooler URL** (`*.pooler.supabase.com:6543/postgres`) — that's the one Vercel/Render should hit, not the direct `5432` URL. Auth credentials are the same.

### Render (API)

1. In the Render dashboard, click **New → Blueprint**, point at this repo. Render detects `./render.yaml`.
2. After the service is created, open its **Environment** tab and set:
   - `DATABASE_URL` — your Supabase pooler URL.
   - `ADMIN_PASSWORD` — anything strong.
   - `FRONTEND_URL` — your Vercel URL (see next step). You can come back and set this after Vercel gives you the hostname.
3. The first deploy will run `pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`, then start `node --enable-source-maps ./dist/index.mjs` from `artifacts/api-server/`. Confirm it's healthy via **Events → Health Check** at `/api/healthz`.
4. Note the public URL: `https://everydaygenius-api.onrender.com` (or whatever you renamed it to).

> **Upload persistence**: PDF uploads write to local disk inside the Render container. On Render's `starter` plan, the filesystem is wiped on every redeploy and on instance restarts. For durable uploads, attach a Render Persistent Disk (mounted at `/uploads`) and point `uploadsDir` at it, or move uploads to Supabase Storage.

### Vercel (frontend)

1. **Add New Project**, import this repo.
2. Set **Root Directory** to `artifacts/everydaygenius`. Vercel walks up, finds `pnpm-workspace.yaml`, and treats it as a pnpm monorepo.
3. The included `vercel.json` sets **Build Command** = `pnpm run build` and **Output Directory** = `dist/public` (Vite writes there because of `vite.config.ts`). The SPA rewrite at `/(.*) → /index.html` handles client-side routing.
4. In **Settings → Environment Variables**, add:
   - `VITE_API_BASE_URL` — your Render public URL, e.g. `https://everydaygenius-api.onrender.com` (no trailing slash).
5. Deploy. Open the deployed URL and click **Admin**. Login with the `ADMIN_PASSWORD` you set on Render.

### Final cross-wiring

After both deploys exist:
- Paste the Vercel URL into Render's `FRONTEND_URL` env var (so CORS allows it).
- Vercel env var changes require a redeploy — re-deploy from the Vercel dashboard after editing.

### Why this split

- **`everydaygenius` on Vercel**: pure SPA, deploys in seconds via `pnpm run build`.
- **`api-server` on Render (not Vercel)**: Express has long-running state — `multer.diskStorage` writes, in-memory `express-session` cookies, 50MB upload bodies — none of which fit Vercel's per-request serverless model without refactoring. Render runs a persistent Node process, so it works as-is.

