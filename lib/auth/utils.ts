import { env } from "@/lib/env/server";

/**
 * Checks if an email is in the admin whitelist
 * @param email - The email address to check
 * @returns true if the email is whitelisted, false otherwise
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = getAdminEmails();

  // If no whitelist is configured, allow no one
  if (adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}

/**
 * Gets the list of admin emails
 * @returns Array of admin email addresses
 */
export function getAdminEmails(): string[] {
  return env.ADMIN_EMAILS;
}
