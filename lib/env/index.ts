/**
 * Environment variables index
 *
 * For better organization and type safety:
 * - Use @/lib/env/server for server-only environment variables
 * - Use @/lib/env/client for client-safe environment variables
 *
 * @example Server-side usage
 * import { env } from "@/lib/env/server";
 * const dbUrl = env.DATABASE_URL;
 *
 * @example Client-side usage
 * import { env } from "@/lib/env/client";
 * const appUrl = env.NEXT_PUBLIC_APP_URL;
 */

// Export everything with explicit naming to avoid conflicts
export { env as serverEnv, type ServerEnv } from "./server";
export { env as clientEnv, type ClientEnv } from "./client";
