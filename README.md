# Chef's Kiss

Website for **Chef's Kiss Festival 2026** — a food festival at Ayia Napa Marina, Cyprus (16–17 May 2026).

The site covers the public-facing festival experience (vendors, workshops, private dining, menu, contact, legal pages) plus an admin dashboard for managing bookings and applications.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with OKLCH colors
- **UI**: [ShadCN UI](https://ui.shadcn.com), [Base UI](https://base-ui.com), [Radix UI](https://radix-ui.com), [Motion](https://motion.dev)
- **Database**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- **Auth**: [BetterAuth](https://better-auth.com) with Google OAuth (admin-only, email allowlist)
- **API**: [tRPC](https://trpc.io) + [TanStack Query](https://tanstack.com/query)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Email**: [Resend](https://resend.com) + [React Email](https://react.email)
- **File Upload**: [Uploadthing](https://uploadthing.com)
- **Package Manager**: pnpm

## Public Pages

- `/` — Landing page (hero, vendor marquee, private dining, workshops, menu CTA, gallery, location)
- `/vendors/apply` — Vendor application form
- `/workshops` + `/workshops/[slug]` + `/workshops/apply` — Browse, view, and apply to run workshops
- `/private-dining` + `/private-dining/book` — Private dining landing and booking flow
- `/menu` + `/menu/[vendorId]` — Vendor menus
- `/contact-us` — Contact info
- `/(legal)/privacy`, `/(legal)/cookies`, `/(legal)/toc` — Legal pages

## Admin

`/admin` (gated by `ADMIN_EMAILS` allowlist via Google OAuth):
- Bookings — manage private dining bookings
- Vendor applications — review, accept/reject (triggers templated email)
- Workshop applications — review, accept/reject (triggers templated email)

## Project Structure

```
/app
  /(legal)              Privacy, cookies, T&Cs
  /admin                Admin dashboard (protected)
  /api
    /auth/[...all]      BetterAuth routes
    /trpc/[trpc]        tRPC handler
    /uploadthing        Upload handler
  /contact-us
  /menu                 Vendor menus
  /private-dining       Landing + booking flow
  /vendors/apply        Vendor application
  /workshops            Browse, detail, apply
/components             Shared components (ui/, site-nav, site-footer, etc.)
/emails                 React Email templates (booking & application emails)
/lib
  /auth                 BetterAuth server + client
  /config               Festival-wide config (event, menu, workshops, socials, mode)
  /db
    /schema             Drizzle tables (users, vendors, events, workshops, applications, bookings)
    /migrations
  /email                Email-sending utilities
  /env                  Zod-validated server.ts / client.ts env
  /trpc
    /routers            bookings, vendors, events, workshops
  /uploadthing
  /validations          Shared Zod schemas
/scripts
  seed-event.ts         Seed the current event
  toggle-routes.ts      Enable/disable routes via routes.config.ts
/routes.config.ts       Phase-based route toggling (see below)
```

## Getting Started

### 1. Install

```bash
pnpm install
```

### 2. Start Postgres

```bash
docker compose up -d
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — pre-configured for the local Docker instance
- `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google Cloud Console (redirect URI: `http://localhost:3000/api/auth/callback/google`)
- `ADMIN_EMAILS` — comma-separated emails allowed into `/admin`
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — Resend dashboard + verified sending domain
- `UPLOADTHING_TOKEN` — Uploadthing dashboard
- `NEXT_PUBLIC_COMING_SOON` — toggles CTAs between "Book" and "Explore" copy
- `VENDOR_LATE_TOKEN` / `WORKSHOP_LATE_TOKEN` — optional secrets to allow late applications past the deadline

All env vars are validated at startup via `lib/env/server.ts` and `lib/env/client.ts` — missing or invalid values fail fast with a clear error.

### 4. Run migrations

```bash
pnpm db:generate    # generate a new migration from schema changes
pnpm db:migrate     # apply migrations
```

> Note: `pnpm db:push` is intentionally disabled. Use `db:migrate`.

### 5. Dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — Next.js dev server
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint
- `pnpm email` — React Email preview server (port 3001)
- `pnpm toggle-routes` — apply `routes.config.ts` by renaming disabled route folders (prefixed with `_` so Next.js ignores them)
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` — Drizzle tooling

## Route Phases

`routes.config.ts` drives which routes are live at each stage of the festival lifecycle (hibernation, vendor applications open, vendors finalized, workshops live, full event live, post-event). Edit the `ROUTES` object (or copy one of the preset configs like `WORKSHOPS_LIVE_CONFIG`), then run `pnpm toggle-routes` followed by `pnpm build`.

Separately, `NEXT_PUBLIC_COMING_SOON` controls CTA copy on the landing page without toggling routes.

## Documentation

See [`docs/`](docs/) for deeper guides:

- [Setup](docs/setup.md)
- [Authentication](docs/authentication.md)
- [Database](docs/database.md)
- [tRPC](docs/trpc.md)
- [Uploadthing](docs/uploadthing.md)
- [Email](docs/email.md)
- [Forms & Validation](docs/forms-validation.md)
- [Environment Variables](docs/environment-variables.md)
- [Colors](docs/colors-usage.md) · [Typography](docs/typography.md)

## Deployment

Production env vars to set (beyond the local ones):

- `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` — production URL
- Add the production redirect URI in Google Cloud Console: `https://yourdomain.com/api/auth/callback/google`
- `DATABASE_URL` — managed Postgres (Neon, Supabase, Vercel Postgres, Railway, etc.)
- Generate a fresh `BETTER_AUTH_SECRET` for production

Deploys cleanly to Vercel.
