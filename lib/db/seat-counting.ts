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
  const bookingsRows = await executor
    .select({
      status: bookings.status,
      total: sql<number>`coalesce(sum(${bookings.seats}), 0)`,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.slotId, slotId),
        inArray(bookings.status, ["confirmed", "pending"]),
      ),
    )
    .groupBy(bookings.status);

  const [holdsRow] = await executor
    .select({
      total: sql<number>`coalesce(sum(${seatHolds.seatCount}), 0)`,
    })
    .from(seatHolds)
    .where(and(eq(seatHolds.slotId, slotId), eq(seatHolds.status, "active")));

  let booked = 0;
  let reserved = 0;
  for (const row of bookingsRows) {
    const total = Number(row.total);
    if (row.status === "confirmed") booked = total;
    else if (row.status === "pending") reserved = total;
  }
  const held = Number(holdsRow?.total ?? 0);

  return { booked, reserved, held };
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
      status: bookings.status,
      total: sql<number>`coalesce(sum(${bookings.seats}), 0)`,
    })
    .from(bookings)
    .where(inArray(bookings.status, ["confirmed", "pending"]))
    .groupBy(bookings.slotId, bookings.status);

  const holdsRows = await database
    .select({
      slotId: seatHolds.slotId,
      total: sql<number>`coalesce(sum(${seatHolds.seatCount}), 0)`,
    })
    .from(seatHolds)
    .where(eq(seatHolds.status, "active"))
    .groupBy(seatHolds.slotId);

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
    const total = Number(row.total);
    if (row.status === "confirmed") entry.booked = total;
    else if (row.status === "pending") entry.reserved = total;
  }
  for (const row of holdsRows) {
    ensure(row.slotId).held = Number(row.total);
  }

  return map;
}
