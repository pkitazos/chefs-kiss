import type { db } from "./index";
import { getTotalBookedSeats } from "./booked-seats";
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
  id: string;
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
): Promise<void> {
  await database.transaction(async (tx) => {
    await lockSlotForWrite(tx, args.slotId);

    const bookedSeats = await getTotalBookedSeats(tx, args.slotId);
    const remaining = args.capacity - bookedSeats;

    if (args.seats > remaining) {
      throw new CapacityExceededError(remaining);
    }

    await tx.insert(bookings).values({
      id: args.id,
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
  });
}
