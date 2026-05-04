import { and, eq, inArray, sql } from "drizzle-orm";

import { bookings } from "./schema";
import type { DbOrTx } from "./seat-locks";

export async function getTotalBookedSeats(
  executor: DbOrTx,
  slotId: string,
): Promise<number> {
  const [row] = await executor
    .select({ total: sql<number>`coalesce(sum(${bookings.seats}), 0)` })
    .from(bookings)
    .where(
      and(
        eq(bookings.slotId, slotId),
        inArray(bookings.status, ["confirmed", "pending"]),
      ),
    );

  return Number(row.total);
}
