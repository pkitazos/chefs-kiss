/**
 * Helpers for inspecting errors thrown by the Postgres driver.
 *
 * Postgres attaches a 5-character SQLSTATE `code` to every server-side error.
 * Class `23` is "Integrity Constraint Violation"; the subclass narrows to the
 * specific constraint. We key off the code (not the message) because messages
 * are human-readable and can change across versions / locales, whereas
 * SQLSTATE codes are stable and standardized.
 *
 * Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */

/** `unique_violation` — a row violated a UNIQUE constraint or unique index. */
export const PG_UNIQUE_VIOLATION = "23505";

/** `foreign_key_violation` — an FK pointed at a nonexistent parent row. */
export const PG_FOREIGN_KEY_VIOLATION = "23503";

/** `not_null_violation` — a NOT NULL column got NULL. */
export const PG_NOT_NULL_VIOLATION = "23502";

/** `check_violation` — a row failed a CHECK constraint. */
export const PG_CHECK_VIOLATION = "23514";

/**
 * Walk the `cause` chain looking for a Postgres SQLSTATE `code`.
 *
 * drizzle-orm ≥ 0.44 wraps driver errors in a `DrizzleQueryError` and hangs
 * the real `PostgresError` off `.cause` — so `err.code` is `undefined` and
 * the code we want is one level (or more, if something else re-wraps) down.
 * We duck-type to stay driver-agnostic.
 *
 * The depth cap is a safety net for pathological / circular cause chains.
 */
function findPgCode(err: unknown, depth = 0): string | null {
  if (depth > 5 || err === null || typeof err !== "object") return null;
  if ("code" in err && typeof (err as { code: unknown }).code === "string") {
    return (err as { code: string }).code;
  }
  if ("cause" in err) {
    return findPgCode((err as { cause: unknown }).cause, depth + 1);
  }
  return null;
}

/** True if `err` (or any error in its `cause` chain) carries a SQLSTATE code. */
export function hasPgErrorCode(err: unknown): boolean {
  return findPgCode(err) !== null;
}

/** True if `err` is a Postgres unique-constraint violation (SQLSTATE 23505). */
export function isUniqueViolation(err: unknown): boolean {
  return findPgCode(err) === PG_UNIQUE_VIOLATION;
}
