import { z } from "zod";

/**
 * Bounds for a single admin seat-hold's seatCount.
 *
 * MIN is enforced by both the DB check constraint (seat_holds_seat_count_positive)
 * and the schemas below. MAX is a soft fat-finger guard, NOT a capacity check —
 * holds are explicitly allowed to push a slot oversold (admin override). Bump
 * this if a real allocation needs more seats; don't lower it without checking
 * the largest workshop/dining capacity in config.
 */
export const MIN_SEAT_HOLD_COUNT = 1;
export const MAX_SEAT_HOLD_COUNT = 100;

const seatCount = z.coerce
  .number<number>()
  .int()
  .min(MIN_SEAT_HOLD_COUNT)
  .max(MAX_SEAT_HOLD_COUNT);

const note = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

export const createSeatHoldSchema = z.object({
  slotId: z.string().min(1),
  seatCount,
  note,
});

export const updateSeatHoldNoteSchema = z.object({
  holdId: z.string().min(1),
  note: z.string().trim().max(500),
});

export const releaseSeatHoldSchema = z.object({
  holdId: z.string().min(1),
});

export type CreateSeatHoldInput = z.infer<typeof createSeatHoldSchema>;
export type UpdateSeatHoldNoteInput = z.infer<typeof updateSeatHoldNoteSchema>;
export type ReleaseSeatHoldInput = z.infer<typeof releaseSeatHoldSchema>;
