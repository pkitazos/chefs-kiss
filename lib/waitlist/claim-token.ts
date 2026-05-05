import crypto from "node:crypto";

import { env } from "@/lib/env/server";

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function signClaimToken(email: string): string {
  return crypto
    .createHmac("sha256", env.WAITLIST_CLAIM_SECRET)
    .update(normaliseEmail(email))
    .digest("base64url");
}

export function verifyClaimToken(email: string, token: string): boolean {
  const expected = Buffer.from(signClaimToken(email), "base64url");
  const received = Buffer.from(token, "base64url");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}
