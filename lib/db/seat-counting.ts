import { and, eq, inArray, sql } from "drizzle-orm";

import type { db } from "./index";
import { bookings, seatHolds } from "./schema";
import type { DbOrTx } from "./seat-locks";

export type SeatBreakdown = {
  capacity: number;
  booked: number;
  reserved: number;
  held: number;
  available: number;
};

export type SeatCounts = {
  booked: number;
  reserved: number;
  held: number;
};

function computeAvailable(capacity: number, counts: SeatCounts): number {
  return Math.max(0, capacity - counts.booked - counts.reserved - counts.held);
}

export function buildSeatBreakdown(
  capacity: number,
  counts: SeatCounts,
): SeatBreakdown {
  return {
    capacity,
    booked: counts.booked,
    reserved: counts.reserved,
    held: counts.held,
    available: computeAvailable(capacity, counts),
  };
}

export async function getSlotSeatCounts(
  executor: DbOrTx,
  slotId: string,
): Promise<SeatCounts> {
  const [bookingsRow] = await executor
    .select({
      booked: sql<number>`coalesce(sum(${bookings.seats}) filter (where ${bookings.status} = 'confirmed'), 0)`,
      reserved: sql<number>`coalesce(sum(${bookings.seats}) filter (where ${bookings.status} = 'pending'), 0)`,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.slotId, slotId),
        inArray(bookings.status, ["confirmed", "pending"]),
      ),
    );

  const [holdsRow] = await executor
    .select({
      held: sql<number>`greatest(0,
        coalesce(sum(${seatHolds.seatCount}) filter (where ${seatHolds.status} = 'active'), 0)
        - coalesce(sum(${seatHolds.seatCount}) filter (where ${seatHolds.status} = 'consumed'), 0)
      )`,
    })
    .from(seatHolds)
    .where(
      and(
        eq(seatHolds.slotId, slotId),
        inArray(seatHolds.status, ["active", "consumed"]),
      ),
    );

  return {
    booked: Number(bookingsRow?.booked ?? 0),
    reserved: Number(bookingsRow?.reserved ?? 0),
    held: Number(holdsRow?.held ?? 0),
  };
}

export async function getSlotSeatBreakdown(
  executor: DbOrTx,
  args: { slotId: string; capacity: number },
): Promise<SeatBreakdown> {
  const counts = await getSlotSeatCounts(executor, args.slotId);
  return buildSeatBreakdown(args.capacity, counts);
}

export type SlotsSeatCountsMap = Map<string, SeatCounts>;

export async function getAllSlotsSeatCounts(
  database: typeof db,
): Promise<SlotsSeatCountsMap> {
  const bookingsRows = await database
    .select({
      slotId: bookings.slotId,
      booked: sql<number>`coalesce(sum(${bookings.seats}) filter (where ${bookings.status} = 'confirmed'), 0)`,
      reserved: sql<number>`coalesce(sum(${bookings.seats}) filter (where ${bookings.status} = 'pending'), 0)`,
    })
    .from(bookings)
    .where(inArray(bookings.status, ["confirmed", "pending"]))
    .groupBy(bookings.slotId);

  const holdsRows = await database
    .select({
      slotId: seatHolds.slotId,
      held: sql<number>`greatest(0,
        coalesce(sum(${seatHolds.seatCount}) filter (where ${seatHolds.status} = 'active'), 0)
        - coalesce(sum(${seatHolds.seatCount}) filter (where ${seatHolds.status} = 'consumed'), 0)
      )`,
    })
    .from(seatHolds)
    .where(inArray(seatHolds.status, ["active", "consumed"]))
    .groupBy(seatHolds.slotId);

  // Merge the two per-slot result sets into one map keyed by slotId. A slot
  // may appear in only one query (e.g. bookings with no holds), so each row
  // get-or-creates an entry seeded with zeros and fills in its own fields.
  const map: SlotsSeatCountsMap = new Map();
  const ensure = (slotId: string): SeatCounts => {
    let entry = map.get(slotId);
    if (!entry) {
      entry = { booked: 0, reserved: 0, held: 0 };
      map.set(slotId, entry);
    }
    return entry;
  };

  for (const row of bookingsRows) {
    const entry = ensure(row.slotId);
    entry.booked = Number(row.booked);
    entry.reserved = Number(row.reserved);
  }
  for (const row of holdsRows) {
    ensure(row.slotId).held = Number(row.held);
  }

  return map;
}
