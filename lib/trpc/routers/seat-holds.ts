import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { getSlotSeatBreakdown } from "@/lib/db/seat-counting";
import { lockSlotForWrite } from "@/lib/db/seat-locks";
import { events, seatHolds } from "@/lib/db/schema";
import {
  createSeatHoldSchema,
  releaseSeatHoldSchema,
  updateSeatHoldNoteSchema,
} from "@/lib/validations/seat-hold";
import { createTRPCRouter, permissionProcedure } from "../init";

function getSlotCapacity(slotId: string): number | null {
  const dining = getDiningSessionById(slotId);
  if (dining) return dining.session.capacity;
  const workshop = getWorkshopSlotById(slotId);
  if (workshop) return workshop.slot.capacity;
  return null;
}

export const seatHoldsRouter = createTRPCRouter({
  hold: permissionProcedure("admin.access")
    .input(createSeatHoldSchema)
    .mutation(async ({ ctx, input }) => {
      const adminUserId = ctx.session.user.id;

      const capacity = getSlotCapacity(input.slotId);
      if (capacity === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid slot ID.",
        });
      }

      return ctx.db.transaction(async (tx) => {
        await lockSlotForWrite(tx, input.slotId);

        const breakdown = await getSlotSeatBreakdown(tx, {
          slotId: input.slotId,
          capacity,
        });

        if (input.seatCount > breakdown.available) {
          console.warn(
            `[seatHolds.hold] Hold of ${input.seatCount} would exceed capacity for ${input.slotId}: capacity=${capacity}, booked=${breakdown.booked}, reserved=${breakdown.reserved}, held=${breakdown.held}. Proceeding (admin override).`,
          );
        }

        const [activeEvent] = await tx
          .select()
          .from(events)
          .where(eq(events.isActive, true))
          .limit(1);

        if (!activeEvent) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No active event found.",
          });
        }

        const [created] = await tx
          .insert(seatHolds)
          .values({
            id: crypto.randomUUID(),
            slotId: input.slotId,
            seatCount: input.seatCount,
            status: "active",
            note: input.note ?? null,
            createdBy: adminUserId,
            eventId: activeEvent.id,
          })
          .returning();

        return created;
      });
    }),

  release: permissionProcedure("admin.access")
    .input(releaseSeatHoldSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [hold] = await tx
          .select()
          .from(seatHolds)
          .where(eq(seatHolds.id, input.holdId))
          .limit(1);

        if (!hold) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Seat hold not found.",
          });
        }

        if (hold.status !== "active") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only active seat holds can be released.",
          });
        }

        await lockSlotForWrite(tx, hold.slotId);

        const now = new Date();
        const [updated] = await tx
          .update(seatHolds)
          .set({ status: "released", releasedAt: now, updatedAt: now })
          .where(
            and(eq(seatHolds.id, input.holdId), eq(seatHolds.status, "active")),
          )
          .returning();

        return updated;
      });
    }),

  update: permissionProcedure("admin.access")
    .input(updateSeatHoldNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const [hold] = await ctx.db
        .select()
        .from(seatHolds)
        .where(eq(seatHolds.id, input.holdId))
        .limit(1);

      if (!hold) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Seat hold not found.",
        });
      }

      if (hold.status !== "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only active seat holds can be edited.",
        });
      }

      const [updated] = await ctx.db
        .update(seatHolds)
        .set({
          note: input.note.length > 0 ? input.note : null,
          updatedAt: new Date(),
        })
        .where(eq(seatHolds.id, input.holdId))
        .returning();

      return updated;
    }),
});
