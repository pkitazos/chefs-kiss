import { TRPCError } from "@trpc/server";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { isUniqueViolation } from "@/lib/db/errors";
import { events, waitlistEntries } from "@/lib/db/schema";
import { sendWaitlistConfirmation } from "@/lib/email/waitlist-emails";
import { generateId } from "@/lib/utils/construct-id";
import { type Event } from "@/lib/validations/event";
import { createWaitlistEntrySchema } from "@/lib/validations/waitlist";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";

export const waitlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(createWaitlistEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const slotExists =
        input.type === "private-dining"
          ? getDiningSessionById(input.slotId) !== null
          : getWorkshopSlotById(input.slotId) !== null;

      if (!slotExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid slot ID.",
        });
      }

      const [activeEvent] = await ctx.db
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

      const eventForId: Event = {
        date: { start: activeEvent.startDate, end: activeEvent.endDate },
        location: activeEvent.location,
        locationCode: activeEvent.locationCode,
      };

      const [countResult] = await ctx.db
        .select({ count: count() })
        .from(waitlistEntries)
        .where(eq(waitlistEntries.eventId, activeEvent.id));
      const entryNumber = (countResult?.count ?? 0) + 1;
      const id = generateId(eventForId, entryNumber, "WL");

      try {
        await ctx.db.insert(waitlistEntries).values({
          id,
          type: input.type,
          slotId: input.slotId,
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          partySize: input.partySize,
          eventId: activeEvent.id,
        });
      } catch (err) {
        if (isUniqueViolation(err)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You're already on the waitlist for this slot.",
          });
        }
        throw err;
      }

      try {
        await sendWaitlistConfirmation({
          email: input.email,
          fullName: input.fullName,
          waitlistId: id,
          type: input.type,
          partySize: input.partySize,
          slotId: input.slotId,
        });
      } catch (err) {
        console.error("Failed to send waitlist confirmation email:", {
          waitlistId: id,
          email: input.email,
          err,
        });
      }

      return { id };
    }),

  listBySlot: protectedProcedure
    .input(z.object({ slotId: z.string().min(1) }))
    .query(async ({ ctx, input }) =>
      ctx.db
        .select()
        .from(waitlistEntries)
        .where(eq(waitlistEntries.slotId, input.slotId))
        .orderBy(desc(waitlistEntries.createdAt)),
    ),

  promote: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .update(waitlistEntries)
        .set({ status: "promoted", updatedAt: new Date() })
        .where(eq(waitlistEntries.id, input.id))
        .returning();

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waitlist entry not found.",
        });
      }

      return row;
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .update(waitlistEntries)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(waitlistEntries.id, input.id))
        .returning();

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waitlist entry not found.",
        });
      }

      return row;
    }),
});
