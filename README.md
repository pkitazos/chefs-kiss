# Chefs Kiss

A production-ready Next.js stack with modern tooling, type-safe APIs, and authentication.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with OKLCH color system
- **UI Components**: [ShadCN UI](https://ui.shadcn.com) (radix-mira style)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [BetterAuth](https://better-auth.com) with Google OAuth
- **API Layer**: [tRPC](https://trpc.io) with [TanStack Query](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev)
- **Forms**: [React Hook Form](https://react-hook-form.com)
- **Email**: [Resend](https://resend.com)
- **File Upload**: [Uploadthing](https://uploadthing.com)
- **Package Manager**: pnpm

## Documentation

**[Full Documentation](docs/README.md)**

Detailed guides for all features:
- [Setup Guide](docs/setup.md) - Get started quickly
- [Authentication](docs/authentication.md) - BetterAuth with Google OAuth
- [Database](docs/database.md) - Drizzle ORM and PostgreSQL
- [tRPC API Layer](docs/trpc.md) - Type-safe API development
- [File Uploads](docs/uploadthing.md) - Uploadthing configuration
- [Email](docs/email.md) - Resend email service
- [Forms & Validation](docs/forms-validation.md) - React Hook Form + Zod
- [Environment Variables](docs/environment-variables.md) - Env validation guide

## Project Structure

```
/app                    - Next.js App Router pages
  /api
    /auth/[...all]      - BetterAuth API routes
    /trpc/[trpc]        - tRPC API handler
    /uploadthing        - Uploadthing file upload handler
/components             - React components
  /ui                   - ShadCN UI components
/docs                   - Documentation for all features
/lib
  /auth                 - Authentication config & client
  /db                   - Database schema & client
    /schema             - Drizzle schema definitions
    /migrations         - Database migrations
  /email                - Email utilities & templates
  /env                  - Environment variable validation
    /server.ts          - Server-only env vars
    /client.ts          - Client-safe env vars
  /trpc                 - tRPC configuration
    /routers            - tRPC API routers
  /uploadthing          - File upload configuration
  /validations          - Shared Zod schemas
```

## Getting Started

### 1. Clone and Install

```bash
pnpm install
```

### 2. Set Up Database

Start the local PostgreSQL database with Docker:

```bash
docker compose up -d
```

Copy the environment variables template:

```bash
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` and fill in the required values:

#### Database
The default DATABASE_URL is already configured for the local Docker database.

#### BetterAuth Secret
Generate a secret key:

```bash
openssl rand -base64 32
```

Add it to `BETTER_AUTH_SECRET` in `.env.local`.

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to `.env.local`

#### Resend
1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add it to `RESEND_API_KEY` in `.env.local`
4. Update `RESEND_FROM_EMAIL` with your verified domain

#### Uploadthing
1. Sign up at [Uploadthing](https://uploadthing.com)
2. Create a new app in the dashboard
3. Copy your app token
4. Add it to `UPLOADTHING_TOKEN` in `.env.local`

### 4. Set Up Database Schema

Push the database schema to your PostgreSQL database:

```bash
pnpm db:push
```

Or generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Environment Variable Validation

This project uses Zod to validate all environment variables at startup. Benefits:

- **Fail fast** with clear error messages if env vars are missing/invalid
- **Type-safe** access to env vars with autocomplete
- **No more `!` assertions** or `??` operators everywhere
- Single source of truth for all environment configuration

### Usage

Instead of `process.env`, import the validated `env` object:

```typescript
// Old way (not type-safe, might be undefined)
const dbUrl = process.env.DATABASE_URL!;

// New way (type-safe, guaranteed to exist)
// Server-side code
import { env } from "@/lib/env/server";
const dbUrl = env.DATABASE_URL;

// Client-side code
import { env } from "@/lib/env/client";
const appUrl = env.NEXT_PUBLIC_APP_URL;
```

The app will fail to start if required env vars are missing, showing you exactly what needs to be configured.

See [lib/env/server.ts](lib/env/server.ts) and [lib/env/client.ts](lib/env/client.ts) for the full validation schemas.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database (dev)
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Key Features

> **Tip**: See the [docs](docs/) directory for detailed guides on each feature.

### Authentication (BetterAuth)

Google OAuth authentication with session management. [Full guide →](docs/authentication.md)

```tsx
import { signIn, signOut, useSession } from "@/lib/auth/client";

const { data: session } = useSession();
```

### Type-Safe APIs (tRPC)

End-to-end type safety with automatic TypeScript inference. [Full guide →](docs/trpc.md)

```tsx
// Server: lib/trpc/routers/example.ts
export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    }),
});

// Client
import { trpc } from "@/lib/trpc/client";

function MyComponent() {
  const { data } = trpc.example.hello.useQuery({ name: "World" });
  return <div>{data?.greeting}</div>;
}
```

### Database (Drizzle ORM)

Type-safe database queries with PostgreSQL. [Full guide →](docs/database.md)

```tsx
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const allUsers = await db.select().from(users);
```

### Forms & Validation

React Hook Form with Zod schema validation. [Full guide →](docs/forms-validation.md)

```tsx
const form = useForm({ resolver: zodResolver(schema) });
```

### File Uploads

Uploadthing for type-safe file uploads. [Full guide →](docs/uploadthing.md)

```tsx
const { startUpload } = useUploadThing("imageUploader");
```

### Email

Resend for transactional emails. [Full guide →](docs/email.md)

```tsx
await sendEmail({ to, subject, html });
```

## Database Management

### View Database with Drizzle Studio

```bash
pnpm db:studio
```

This opens a web UI at https://local.drizzle.studio to browse and edit your database.

### Stop Database

```bash
docker compose down
```

To remove the data volume as well:

```bash
docker compose down -v
```

## Deployment

### Environment Variables

Make sure to set all required environment variables in your production environment:

- `DATABASE_URL` - Your production PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate a new secret for production
- `BETTER_AUTH_URL` - Your production URL (e.g., `https://yourdomain.com`)
- `NEXT_PUBLIC_APP_URL` - Your production URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- Add redirect URI in Google Console: `https://yourdomain.com/api/auth/callback/google`
- `RESEND_API_KEY` & `RESEND_FROM_EMAIL` - For production emails
- `UPLOADTHING_TOKEN` - From Uploadthing dashboard (for file uploads)

### Deploy to Vercel

The easiest deployment option:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

For database hosting, consider:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [BetterAuth Documentation](https://better-auth.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Uploadthing Documentation](https://docs.uploadthing.com)
