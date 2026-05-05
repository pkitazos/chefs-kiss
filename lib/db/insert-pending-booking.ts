import { sql } from "drizzle-orm";

import type { RefCategory } from "@/lib/ids";

import type { db } from "./index";
import { nextRef } from "./ref-sequence";
import { bookings } from "./schema";
import { getSlotSeatBreakdown } from "./seat-counting";
import { lockSlotForWrite } from "./seat-locks";

export class CapacityExceededError extends Error {
  constructor(public readonly remaining: number) {
    super(
      remaining === 0
        ? "This slot is fully booked."
        : `Only ${remaining} seat(s) remaining.`,
    );
    this.name = "CapacityExceededError";
  }
}

export type InsertPendingBookingArgs = {
  slotId: string;
  capacity: number;
  seats: number;
  type: "workshop" | "private-dining";
  fullName: string;
  email: string;
  phone: string;
  browserSessionId: string | null;
  totalAmount: number;
  expiresAt: Date;
  eventId: string;
  refPattern: string;
  year: number;
  category: RefCategory;
  locationCode: string;
};

/**
 * Insert a pending booking, atomically rejecting the call if the requested
 * seat count would exceed slot capacity.
 *
 * Customer-facing path only.
 *
 * Throws CapacityExceededError on full slots, so admin flows that need to oversell
 * (e.g. waitlist.promote) must NOT use this. They should take the same advisory lock
 * via lockSlotForWrite() and insert directly, with their own warn-and-proceed handling.
 */
export async function insertPendingBooking(
  database: typeof db,
  args: InsertPendingBookingArgs,
): Promise<string> {
  return await database.transaction(async (tx) => {
    // Serialize ID generation across all slots in the same category to
    // prevent two concurrent requests from computing the same sequence.
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${`booking-seq:${args.refPattern}`}, 0))`,
    );
    await lockSlotForWrite(tx, args.slotId);

    const breakdown = await getSlotSeatBreakdown(tx, {
      slotId: args.slotId,
      capacity: args.capacity,
    });

    if (args.seats > breakdown.available) {
      throw new CapacityExceededError(breakdown.available);
    }

    const bookingId = await nextRef(tx, bookings, args.refPattern, {
      year: args.year,
      type: "BK",
      category: args.category,
      locationCode: args.locationCode,
    });

    await tx.insert(bookings).values({
      id: bookingId,
      type: args.type,
      slotId: args.slotId,
      fullName: args.fullName,
      email: args.email,
      phone: args.phone,
      seats: args.seats,
      totalAmount: args.totalAmount,
      browserSessionId: args.browserSessionId,
      eventId: args.eventId,
      expiresAt: args.expiresAt,
    });

    return bookingId;
  });
}
