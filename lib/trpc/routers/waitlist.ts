import { TRPCError } from "@trpc/server";
import { asc, count, eq } from "drizzle-orm";
import { z } from "zod";

import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { isUniqueViolation } from "@/lib/db/errors";
import { bookings, events, waitlistEntries } from "@/lib/db/schema";
import {
  sendWaitlistConfirmation,
  sendWaitlistPromotion,
} from "@/lib/email/waitlist-emails";
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
        .orderBy(asc(waitlistEntries.createdAt)),
    ),

  promote: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const [entry] = await tx
          .select()
          .from(waitlistEntries)
          .where(eq(waitlistEntries.id, input.id))
          .limit(1)
          .for("update");

        if (!entry) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Waitlist entry not found.",
          });
        }

        if (entry.status !== "waiting") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Waitlist entry is not in the waiting state.",
          });
        }

        const price =
          entry.type === "private-dining"
            ? (getDiningSessionById(entry.slotId)?.session.price ?? null)
            : (getWorkshopSlotById(entry.slotId)?.slot.price ?? null);

        if (price === null) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Slot configuration not found for this waitlist entry.",
          });
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

        const eventForId: Event = {
          date: { start: activeEvent.startDate, end: activeEvent.endDate },
          location: activeEvent.location,
          locationCode: activeEvent.locationCode,
        };

        const [countResult] = await tx
          .select({ count: count() })
          .from(bookings)
          .where(eq(bookings.eventId, activeEvent.id));
        const bookingNumber = (countResult?.count ?? 0) + 1;
        const bookingId = generateId(eventForId, bookingNumber, "BK");

        const totalAmount = price * entry.partySize * 100;

        const [booking] = await tx
          .insert(bookings)
          .values({
            id: bookingId,
            type: entry.type,
            status: "confirmed",
            paymentMethod: "in-person",
            slotId: entry.slotId,
            fullName: entry.fullName,
            email: entry.email,
            phone: entry.phone,
            seats: entry.partySize,
            totalAmount,
            paidAt: null,
            expiresAt: null,
            eventId: activeEvent.id,
          })
          .returning();

        const [waitlistEntry] = await tx
          .update(waitlistEntries)
          .set({ status: "promoted", updatedAt: new Date() })
          .where(eq(waitlistEntries.id, entry.id))
          .returning();

        return { waitlistEntry, booking };
      });

      try {
        await sendWaitlistPromotion({
          email: result.booking.email,
          fullName: result.booking.fullName,
          bookingId: result.booking.id,
          type: result.booking.type,
          partySize: result.booking.seats,
          slotId: result.booking.slotId,
        });
      } catch (err) {
        console.error("Failed to send waitlist promotion email:", {
          bookingId: result.booking.id,
          email: result.booking.email,
          err,
        });
      }

      return result;
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [entry] = await ctx.db
        .select()
        .from(waitlistEntries)
        .where(eq(waitlistEntries.id, input.id))
        .limit(1);

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waitlist entry not found.",
        });
      }

      if (entry.status !== "waiting") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Waitlist entry is not in the waiting state.",
        });
      }

      const [row] = await ctx.db
        .update(waitlistEntries)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(waitlistEntries.id, input.id))
        .returning();

      return row;
    }),
});
