import { z } from "zod";

/**
 * Server-side environment variable validation schema
 *
 * This file validates server-only environment variables.
 * Import this ONLY in server-side code (API routes, server components, etc.)
 *
 */

const serverEnvSchema = z.object({
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
      "Secret key for BetterAuth (generate with: openssl rand -base64 32)",
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
  RESEND_API_KEY: z
    .string()
    .min(1)
    .describe("Resend API key for sending emails"),
  RESEND_FROM_EMAIL: z
    .email()
    .describe("Default from email address for Resend"),

  // Uploadthing (File Upload)
  UPLOADTHING_TOKEN: z
    .string()
    .min(1)
    .describe("Uploadthing token for file uploads"),

  // Admin Authentication
  ADMIN_EMAILS: z
    .string()
    .transform((xs) => xs.split(",").map((x) => x.trim().toLowerCase()))
    .default([])
    .describe(
      "Comma-separated list of admin emails allowed to access the system",
    ),

  VENDOR_LATE_TOKEN: z
    .string()
    .min(16)
    .optional()
    .describe("Secret token for late vendor applications"),
  WORKSHOP_LATE_TOKEN: z
    .string()
    .min(16)
    .optional()
    .describe("Secret token for late workshop applications"),
});

/**
 * Validates and parses server-side environment variables
 * Throws an error with detailed messages if validation fails
 */
function validateServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid server environment variables:",
      JSON.stringify(parsed.error.format(), null, 2),
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

/**
 * Validated and type-safe server environment variables
 * Import this ONLY in server-side code
 *
 * @example
 * import { env } from "@/lib/env.server";
 *
 * const dbUrl = env.DATABASE_URL; // Type-safe, guaranteed to exist
 */
export const env = validateServerEnv();

/**
 * Type of the validated server environment variables
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;
