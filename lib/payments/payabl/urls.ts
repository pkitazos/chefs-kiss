import { env as clientEnv } from "@/lib/env/client";

function getAppBase(): string {
  return clientEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
}

/**
 * Returns the URL that payabl (or the sim) will POST the callback to
 * when a payment completes.
 *
 * We embed the bookingId in the path for two reasons:
 *   1. Defensive lookup — the callback handler can verify the orderid in
 *      the POST body matches the bookingId in the URL before trusting it.
 *   2. Log clarity — URLs in Vercel logs tell you which booking the
 *      callback is for, without parsing request bodies.
 */
export function buildNotificationUrl(bookingId: string): string {
  return `${getAppBase()}/api/payments/callback/${bookingId}`;
}

/**
 * Returns the URL the user's browser is redirected to after the payment
 * attempt — success, failure, or cancel. The status page on the other
 * end is expected to poll the booking's current status.
 */
export function buildReturnUrl(
  type: "workshop" | "private-dining",
  slug: string | null,
): string {
  const base = clientEnv.NEXT_PUBLIC_APP_URL;

  if (type === "workshop") {
    if (!slug) {
      throw new Error("Workshop bookings require a slug for the return URL");
    }
    return `${base}/workshops/${slug}/book/status`;
  }

  return `${base}/private-dining/book/status`;
}
