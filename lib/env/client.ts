import { z } from "zod";

/**
 * Client-side environment variable validation schema
 *
 * This file validates client-side (NEXT_PUBLIC_*) environment variables.
 * These are safe to use in browser code.
 *
 */

const clientEnvSchema = z.object({
  // App URLs - Available on client side
  NEXT_PUBLIC_APP_URL: z
    .url()
    .default("http://localhost:3000")
    .describe("Public URL of the application"),
});

/**
 * Validates and parses client-side environment variables
 */
function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid client environment variables:",
      JSON.stringify(z.treeifyError(parsed.error), null, 2),
    );
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
}

/**
 * Validated and type-safe client environment variables
 * Safe to import in both client and server code
 *
 * @example
 * import { env } from "@/lib/env.client";
 *
 * const appUrl = env.NEXT_PUBLIC_APP_URL; // Type-safe, available in browser
 */
export const env = validateClientEnv();

/**
 * Type of the validated client environment variables
 */
export type ClientEnv = z.infer<typeof clientEnvSchema>;
