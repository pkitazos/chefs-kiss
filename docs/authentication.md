# Authentication with BetterAuth

This project uses [BetterAuth](https://better-auth.com) for authentication with Google OAuth.

## Overview

- **Provider**: Google OAuth only (no email/password)
- **Session Management**: Built into BetterAuth
- **Database Adapter**: Drizzle ORM
- **Protected Routes**: Middleware available for both API and pages

## File Locations

- **Server Config**: [lib/auth/index.ts](../lib/auth/index.ts)
- **Client Hooks**: [lib/auth/client.ts](../lib/auth/client.ts)
- **API Routes**: [app/api/auth/[...all]/route.ts](../app/api/auth/[...all]/route.ts)
- **Database Schema**: [lib/db/schema/users.ts](../lib/db/schema/users.ts)

## Setup

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Add credentials to `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 2. Generate Auth Secret

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```bash
BETTER_AUTH_SECRET="generated-secret-here"
```

## Client Usage

### Sign In

```tsx
import { signIn } from "@/lib/auth/client";

export function LoginButton() {
  return (
    <button
      onClick={() =>
        signIn.social({
          provider: "google",
          callbackURL: "/dashboard", // Optional redirect after login
        })
      }
    >
      Sign in with Google
    </button>
  );
}
```

### Sign Out

```tsx
import { signOut } from "@/lib/auth/client";

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign Out</button>;
}
```

### Get Current Session

```tsx
import { useSession } from "@/lib/auth/client";

export function ProfileCard() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      {session.user.image && <img src={session.user.image} alt="Avatar" />}
    </div>
  );
}
```

## Server Usage

### Get Session in API Routes

```typescript
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ user: session.user });
}
```

### Protected tRPC Procedures

```typescript
import { protectedProcedure } from "@/lib/trpc/init";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    // ctx.session.user is guaranteed to exist
    return {
      name: ctx.session.user.name,
      email: ctx.session.user.email,
    };
  }),
});
```

## Database Schema

BetterAuth automatically uses these tables:

```typescript
// Users table
users: {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sessions table
sessions: {
  id: string;
  expiresAt: Date;
  token: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

// OAuth accounts
accounts: {
  id: string;
  accountId: string;
  providerId: string; // "google"
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  // ... more OAuth fields
}
```

## Protecting Pages

### Using Server Components

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Using Client Components

```tsx
"use client";

import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return <div>Welcome, {session.user.name}!</div>;
}
```

## Session Type

```typescript
import type { Session } from "@/lib/auth";

// Session type is available for type safety
function handleSession(session: Session) {
  console.log(session.user.name);
  console.log(session.user.email);
  console.log(session.user.id);
}
```

## Adding More OAuth Providers

To add additional OAuth providers (GitHub, Facebook, etc.):

1. Update [lib/auth/index.ts](../lib/auth/index.ts):
   ```typescript
   socialProviders: {
     google: { ... },
     github: {
       clientId: env.GITHUB_CLIENT_ID,
       clientSecret: env.GITHUB_CLIENT_SECRET,
     },
   },
   ```

2. Add credentials to [lib/env.ts](../lib/env.ts) and `.env.local`

3. Update sign-in button:
   ```tsx
   signIn.social({ provider: "github" })
   ```

## Troubleshooting

### "Unauthorized" errors
- Check `BETTER_AUTH_SECRET` is set and at least 32 characters
- Verify Google OAuth credentials are correct
- Ensure redirect URIs match exactly in Google Console

### Session not persisting
- Check that cookies are enabled in browser
- Verify `NEXT_PUBLIC_APP_URL` matches your actual URL
- Clear browser cookies and try again

### OAuth callback errors
- Double-check redirect URI in Google Console matches exactly
- Ensure `BETTER_AUTH_URL` is set correctly
- Check browser console for detailed error messages

## Learn More

- [BetterAuth Documentation](https://better-auth.com/docs)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
