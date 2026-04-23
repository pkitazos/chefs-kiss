import { createHash } from "node:crypto";

/**
 * Signs an outbound request to payabl's init endpoint.
 *
 * Algorithm (per payabl docs):
 * 1. Sort params by key name alphabetically
 * 2. Concatenate values in that order (values only, no keys, no separators)
 * 3. Append the secret
 * 4. SHA-1, hex, lowercase
 *
 * Params must NOT be URL-encoded before signing.
 * The `signature` key itself must be excluded if present.
 */
export function signRequest(
  params: Record<string, string>,
  secret: string,
): string {
  const concatenated = Object.keys(params)
    .filter((key) => key !== "signature")
    .sort()
    .map((key) => params[key])
    .join("");

  return createHash("sha1")
    .update(concatenated + secret)
    .digest("hex");
}

/**
 * Computes the expected signature for an inbound notification from payabl.
 *
 * Algorithm (per payabl docs, "Simplified Signature for notifications"):
 *   SHA-256(transactionid + type + errorcode + timestamp + secret)
 * Hex, lowercase.
 *
 * Unlike signRequest, this uses a FIXED set of fields regardless of what
 * else is in the payload.
 */
export function computeNotificationSignature(
  params: {
    transactionid: string;
    type: string;
    errorcode: string;
    timestamp: string;
  },
  secret: string,
): string {
  const concatenated =
    params.transactionid +
    params.type +
    params.errorcode +
    params.timestamp +
    secret;

  return createHash("sha256").update(concatenated).digest("hex");
}

/**
 * Verifies that a notification's `security` field matches what we'd
 * compute from its claimed fields. Returns true if valid.
 *
 * Uses timing-safe comparison to prevent timing attacks, though this is
 * probably overkill for a payment callback — a leaked signature tells an
 * attacker essentially nothing without the secret.
 */
export function verifyNotification(
  params: {
    transactionid: string;
    type: string;
    errorcode: string;
    timestamp: string;
    security: string;
  },
  secret: string,
): boolean {
  const expected = computeNotificationSignature(params, secret);
  const provided = params.security;

  if (expected.length !== provided.length) return false;

  // Timing-safe comparison
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return mismatch === 0;
}
