import { sql } from "drizzle-orm";

import {
  buildBookingOrWaitlistRef,
  parseBookingOrWaitlistRef,
  type BookingOrWaitlistRefParts,
} from "@/lib/ids";

import { bookings, waitlistEntries } from "./schema";
import type { DbOrTx } from "./seat-locks";

export async function nextRef(
  executor: DbOrTx,
  table: typeof bookings | typeof waitlistEntries,
  refPattern: string,
  parts: Omit<BookingOrWaitlistRefParts, "sequence">,
): Promise<string> {
  const [row] = await executor
    .select({ maxId: sql<string | null>`max(${table.id})` })
    .from(table)
    .where(sql`${table.id} LIKE ${refPattern}`);

  const parsed = row?.maxId ? parseBookingOrWaitlistRef(row.maxId) : null;

  return buildBookingOrWaitlistRef({
    ...parts,
    sequence: (parsed?.sequence ?? 0) + 1,
  });
}
