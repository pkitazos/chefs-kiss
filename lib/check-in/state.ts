import { desc, eq, inArray } from "drizzle-orm";
import type { DbOrTx } from "@/lib/db/seat-locks";
import {
  type CheckInEvent,
  checkInEvents,
} from "@/lib/db/schema/check-in-events";

export type CheckInState = {
  isCheckedIn: boolean;
  lastEvent: CheckInEvent | null;
};

export async function getCurrentCheckInState(
  db: DbOrTx,
  bookingId: string,
): Promise<CheckInState> {
  const [lastEvent] = await db
    .select()
    .from(checkInEvents)
    .where(eq(checkInEvents.bookingId, bookingId))
    .orderBy(desc(checkInEvents.createdAt))
    .limit(1);

  return {
    isCheckedIn: lastEvent?.action === "checked_in",
    lastEvent: lastEvent ?? null,
  };
}

export async function getCurrentCheckInStateForBookings(
  db: DbOrTx,
  bookingIds: string[],
): Promise<Map<string, CheckInState>> {
  const stateMap = new Map<string, CheckInState>();

  if (bookingIds.length === 0) return stateMap;

  for (const id of bookingIds) {
    stateMap.set(id, { isCheckedIn: false, lastEvent: null });
  }

  const rows = await db
    .selectDistinctOn([checkInEvents.bookingId])
    .from(checkInEvents)
    .where(inArray(checkInEvents.bookingId, bookingIds))
    .orderBy(checkInEvents.bookingId, desc(checkInEvents.createdAt));

  for (const row of rows) {
    stateMap.set(row.bookingId, {
      isCheckedIn: row.action === "checked_in",
      lastEvent: row,
    });
  }

  return stateMap;
}
