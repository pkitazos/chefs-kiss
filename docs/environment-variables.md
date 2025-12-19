# Environment Variable Validation Examples

This file shows how the environment validation works and what error messages you'll see.

## Successful Validation

When all required environment variables are set correctly:

```bash
✓ Environment validated successfully
✓ Starting server...
```

## Missing Required Variable

If `DATABASE_URL` is missing:

```bash
❌ Invalid environment variables: {
  "DATABASE_URL": {
    "_errors": ["Required"]
  }
}
Error: Invalid environment variables
```

## Invalid Format

If `DATABASE_URL` is not a valid URL:

```bash
❌ Invalid environment variables: {
  "DATABASE_URL": {
    "_errors": ["Invalid url"]
  }
}
Error: Invalid environment variables
```

## Secret Too Short

If `BETTER_AUTH_SECRET` is less than 32 characters:

```bash
❌ Invalid environment variables: {
  "BETTER_AUTH_SECRET": {
    "_errors": ["BETTER_AUTH_SECRET must be at least 32 characters"]
  }
}
Error: Invalid environment variables
```

## Multiple Errors

If multiple variables are invalid:

```bash
❌ Invalid environment variables: {
  "DATABASE_URL": {
    "_errors": ["Required"]
  },
  "GOOGLE_CLIENT_ID": {
    "_errors": ["Required"]
  },
  "GOOGLE_CLIENT_SECRET": {
    "_errors": ["Required"]
  }
}
Error: Invalid environment variables
```

## Adding New Environment Variables

To add a new environment variable:

1. Determine if it's a server-only or client-safe variable:
   - **Server-only** (secrets, API keys, DB URLs): Add to `lib/env/server.ts`
   - **Client-safe** (public URLs, feature flags): Add to `lib/env/client.ts` and prefix with `NEXT_PUBLIC_`

2. Add it to the appropriate schema:

   **For server-only variables** in `lib/env/server.ts`:
   ```typescript
   MY_NEW_VAR: z.string().min(1, "MY_NEW_VAR is required"),
   ```

   **For client-safe variables** in `lib/env/client.ts`:
   ```typescript
   NEXT_PUBLIC_MY_VAR: z.string().min(1, "NEXT_PUBLIC_MY_VAR is required"),
   ```

3. Add it to `.env.example`:
   ```bash
   MY_NEW_VAR=""
   # or
   NEXT_PUBLIC_MY_VAR=""
   ```

4. Add it to your `.env`:
   ```bash
   MY_NEW_VAR="actual-value"
   ```

5. Use it in your code:

   **Server-side code** (API routes, server components):
   ```typescript
   import { env } from "@/lib/env/server";
   const myVar = env.MY_NEW_VAR; // Type-safe!
   ```

   **Client-side code** (React components):
   ```typescript
   import { env } from "@/lib/env/client";
   const myVar = env.NEXT_PUBLIC_MY_VAR; // Type-safe!
   ```

## Type Safety

The `env` object is fully typed based on your Zod schema:

**Server-side:**
```typescript
import { env } from "@/lib/env/server";

// Autocomplete works
env.DATABASE_URL;
env.GOOGLE_CLIENT_ID;
env.GOOGLE_CLIENT_SECRET;

// TypeScript error - property doesn't exist
env.NONEXISTENT_VAR;

// All env vars are typed as string (guaranteed to exist)
const url: string = env.DATABASE_URL;
const apiKey: string = env.RESEND_API_KEY;
```

**Client-side:**
```typescript
import { env } from "@/lib/env/client";

// Only NEXT_PUBLIC_* variables are available
env.NEXT_PUBLIC_APP_URL;

// TypeScript error - server-only variable not available
env.DATABASE_URL;
```
