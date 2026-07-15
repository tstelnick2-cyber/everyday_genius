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

## Deploy (Vercel + Fly.io + Supabase)

The frontend (`everydaygenius`) ships to Vercel; the Express API (`api-server`) ships to Fly.io; Postgres runs on Supabase.

### One-time setup on Supabase

1. Create a Supabase project (free tier is fine).
2. In **Project Settings → Database**, copy the **Transaction-mode pooler URL** (`*.pooler.supabase.com:6543/postgres`) — that's the one Fly/Vercel should hit, not the direct `5432` URL. Auth credentials are the same.

### Fly.io (API)

The repo ships a ready-made `Dockerfile` + `fly.toml` that installs the pnpm workspace, builds `api-server`, and runs it on `process.env.PORT = 8080`.

1. **Install the CLI**: https://fly.io/docs/hands-on/install-flyctl/
2. **Login**: `fly auth login`.
3. **Create the volume** *before* first deploy so uploads survive restarts:
   ```bash
   fly volumes create uploads --size 1
   ```
   (Free shared-cpu-1x 256MB machines don't support volumes — you'll need at least `shared-cpu-1x: 1GB` for persistence. ~$1.92/mo per machine.)
4. **First-time launch** (creates the app from `fly.toml`):
   ```bash
   fly launch --no-deploy --copy-config
   ```
   `--copy-config` is what makes Fly pick up the existing `fly.toml` and `Dockerfile` instead of generating its own. If Fly asks to tweak settings, decline.
5. **Set secrets** (do not commit these):
   ```bash
   fly secrets set DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:6543/postgres"
   fly secrets set ADMIN_PASSWORD="<strong-password>"
   fly secrets set SESSION_SECRET="$(openssl rand -hex 32)"
   ```
6. **Set the CORS origin** (do this after Vercel deploys):
   ```bash
   fly secrets set FRONTEND_URL="https://everydaygenius.vercel.app"
   ```
   *(Or use the dashboard **Secrets** tab — values are listed there too.)*
7. **Deploy**:
   ```bash
   fly deploy
   ```
   First build is slow (Node + pnpm install inside Docker). Subsequent deploys use the build cache.
8. Note the public URL Fly prints (defaults to `https://everydaygenius-api.fly.dev`).
9. Verify the health check: `curl https://everydaygenius-api.fly.dev/api/healthz` should return `{"status":"ok"}`.

> **Upload persistence** depends on the volume created in step 3. The code reads `process.env.UPLOADS_DIR` (set to `/uploads` in `fly.toml`); the volume mounts at that path. Without the volume, uploads work but vanish on every container restart.

### Vercel (frontend)

1. **Add New Project**, import this repo.
2. Set **Root Directory** to `artifacts/everydaygenius`. Vercel walks up, finds `pnpm-workspace.yaml`, and treats it as a pnpm monorepo.
3. The included `vercel.json` sets **Build Command** = `pnpm run build` and **Output Directory** = `dist/public` (Vite writes there because of `vite.config.ts`). The SPA rewrite at `/(.*) → /index.html` handles client-side routing.
4. In **Settings → Environment Variables**, add:
   - `VITE_API_BASE_URL` — your Fly public URL, e.g. `https://everydaygenius-api.fly.dev` (no trailing slash).
5. Deploy. Open the deployed URL and click **Admin**. Login with the `ADMIN_PASSWORD` you set on Fly.

### Final cross-wiring

After both deploys exist:
- Paste the Vercel URL into Fly's `FRONTEND_URL` secret (so CORS allows it): `fly secrets set FRONTEND_URL="https://..."`.
- Vercel env var changes require a redeploy — re-deploy from the Vercel dashboard after editing.

### Why this split

- **`everydaygenius` on Vercel**: pure SPA, deploys in seconds via `pnpm run build`.
- **`api-server` on Fly.io (not Vercel)**: Express has long-running state — `multer.diskStorage` writes, in-memory `express-session` cookies, 50MB upload bodies — none of which fit Vercel's per-request serverless model without refactoring. Fly runs a persistent Node process and supports a mounted persistent volume for the `uploads/` directory, so it works as-is.

