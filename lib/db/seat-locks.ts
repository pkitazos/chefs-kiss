import { sql } from "drizzle-orm";

import type { db } from "./index";

export type DbOrTx =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Acquire a transaction-scoped advisory lock keyed on slotId.
 *
 * Why xact (not session) lock: the postgres-js driver runs with prepare:false
 * because of pgBouncer transaction-pool mode, and session locks would leak
 * across pooled connection reuse. Xact locks release on COMMIT/ROLLBACK.
 *
 * Why advisory (not row-level): SELECT ... FOR UPDATE doesn't serialise the
 * "no rows yet" case, so two first-bookings to the same slot would both pass
 * the capacity check.
 */
export async function lockSlotForWrite(executor: DbOrTx, slotId: string) {
  await executor.execute(
    sql`SELECT pg_advisory_xact_lock(hashtextextended(${slotId}, 0))`,
  );
}
