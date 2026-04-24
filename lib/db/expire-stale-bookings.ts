import { and, eq, lt } from "drizzle-orm";

import { db } from "./index";
import { bookings } from "./schema";

/** Expire all stale pending bookings (older than 15 min) in one UPDATE. */
export async function expireStalePendingBookings(database: typeof db) {
  await database
    .update(bookings)
    .set({ status: "expired", updatedAt: new Date() })
    .where(
      and(eq(bookings.status, "pending"), lt(bookings.expiresAt, new Date())),
    );
}
