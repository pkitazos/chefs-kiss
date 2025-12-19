import { z } from "zod";

/**
 * Environment variable validation schema
 *
 * This file validates all environment variables at startup and provides
 * type-safe access throughout the application.
 *
 */

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.url().min(1, "DATABASE_URL is required"),

  // App URLs
  NEXT_PUBLIC_APP_URL: z
    .url()
    .default("http://localhost:3000")
    .describe("Public URL of the application"),

  // BetterAuth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
    .describe(
      "Secret key for BetterAuth (generate with: openssl rand -base64 32)"
    ),
  BETTER_AUTH_URL: z
    .url()
    .default("http://localhost:3000")
    .describe("URL for BetterAuth callbacks"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, "GOOGLE_CLIENT_ID is required")
    .describe("Google OAuth Client ID from Google Cloud Console"),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_CLIENT_SECRET is required")
    .describe("Google OAuth Client Secret from Google Cloud Console"),

  // Resend (Email)
  RESEND_API_KEY: z.string().describe("Resend API key for sending emails"),
  RESEND_FROM_EMAIL: z
    .email()
    .describe("Default from email address for Resend"),

  // Uploadthing (File Upload)
  UPLOADTHING_TOKEN: z.string().describe("Uploadthing token for file uploads"),
});

/**
 * Validates and parses environment variables
 * Throws an error with detailed messages if validation fails
 */
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(z.treeifyError(parsed.error), null, 2)
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

/**
 * Validated and type-safe environment variables
 * Import this instead of using process.env directly
 *
 * @example
 * import { env } from "@/lib/env";
 *
 * const dbUrl = env.DATABASE_URL; // Type-safe, guaranteed to exist
 */
export const env = validateEnv();

/**
 * Type of the validated environment variables
 * Useful for dependency injection or testing
 */
export type Env = z.infer<typeof envSchema>;
