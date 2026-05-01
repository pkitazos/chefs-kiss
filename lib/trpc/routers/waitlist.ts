import { TRPCError } from "@trpc/server";
import { and, asc, count, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { isUniqueViolation } from "@/lib/db/errors";
import { expireStalePendingBookings } from "@/lib/db/expire-stale-bookings";
import { getSlotSeatBreakdown } from "@/lib/db/seat-counting";
import { lockSlotForWrite } from "@/lib/db/seat-locks";
import { bookings, events, seatHolds, waitlistEntries } from "@/lib/db/schema";
import { resolveSlotLabel } from "@/lib/email/booking-emails";
import {
  sendWaitlistConfirmation,
  sendWaitlistPromotion,
} from "@/lib/email/waitlist-emails";
import { clientEnv } from "@/lib/env";
import {
  buildBookingOrWaitlistRef,
  categoryFromSlotId,
  refLikePatternForCategory,
} from "@/lib/ids";
import { initBookingPayment } from "@/lib/payments/init-booking-payment";
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

      const category = categoryFromSlotId(input.slotId);
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not derive category from slot ID.",
        });
      }

      const year = activeEvent.startDate.getFullYear();
      const refPattern = refLikePatternForCategory(year, "WL", category);

      const [countResult] = await ctx.db
        .select({ count: count() })
        .from(waitlistEntries)
        .where(
          and(
            eq(waitlistEntries.eventId, activeEvent.id),
            sql`${waitlistEntries.id} LIKE ${refPattern}`,
          ),
        );
      const sequence = (countResult?.count ?? 0) + 1;
      const id = buildBookingOrWaitlistRef({
        year,
        type: "WL",
        category,
        sequence,
        locationCode: activeEvent.locationCode,
      });

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

        await lockSlotForWrite(tx, entry.slotId);

        const slotConfig =
          entry.type === "private-dining"
            ? (getDiningSessionById(entry.slotId)?.session ?? null)
            : (getWorkshopSlotById(entry.slotId)?.slot ?? null);

        if (!slotConfig) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Slot configuration not found for this waitlist entry.",
          });
        }

        const { price, capacity } = slotConfig;

        const breakdown = await getSlotSeatBreakdown(tx, {
          slotId: entry.slotId,
          capacity,
        });

        const seatsFromHeld = Math.min(entry.partySize, breakdown.held);
        const seatsFromAvailable = entry.partySize - seatsFromHeld;

        if (seatsFromAvailable > breakdown.available) {
          console.warn(
            `[waitlist.promote] Promoting ${entry.id} would exceed capacity for ${entry.slotId}: capacity=${capacity}, booked=${breakdown.booked}, reserved=${breakdown.reserved}, held=${breakdown.held}, adding=${seatsFromAvailable}. Proceeding (warn-and-allow).`,
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

        if (seatsFromHeld > 0) {
          await tx.insert(seatHolds).values({
            id: crypto.randomUUID(),
            slotId: entry.slotId,
            seatCount: seatsFromHeld,
            status: "consumed",
            note: `Consumed by promotion of waitlist entry ${entry.id}`,
            createdBy: ctx.session.user.id,
            eventId: activeEvent.id,
          });
        }

        const category = categoryFromSlotId(entry.slotId);
        if (!category) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not derive category from slot ID.",
          });
        }

        const year = activeEvent.startDate.getFullYear();
        const refPattern = refLikePatternForCategory(year, "BK", category);

        const [countResult] = await tx
          .select({ count: count() })
          .from(bookings)
          .where(
            and(
              eq(bookings.eventId, activeEvent.id),
              sql`${bookings.id} LIKE ${refPattern}`,
            ),
          );
        const sequence = (countResult?.count ?? 0) + 1;
        const bookingId = buildBookingOrWaitlistRef({
          year,
          type: "BK",
          category,
          sequence,
          locationCode: activeEvent.locationCode,
        });

        const totalAmount = price * entry.partySize * 100;

        const [booking] = await tx
          .insert(bookings)
          .values({
            id: bookingId,
            type: entry.type,
            status: "pending",
            paymentMethod: "online",
            slotId: entry.slotId,
            fullName: entry.fullName,
            email: entry.email,
            phone: entry.phone,
            seats: entry.partySize,
            totalAmount,
            paidAt: null,
            expiresAt: null,
            eventId: activeEvent.id,
            waitlistEntryId: entry.id,
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
          claimUrl: `${clientEnv.NEXT_PUBLIC_APP_URL}/waitlist/claim?id=${result.waitlistEntry.id}`,
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

  getClaimEntry: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      const [entry] = await ctx.db
        .select()
        .from(waitlistEntries)
        .where(eq(waitlistEntries.id, input.id))
        .limit(1);

      if (!entry) {
        return { state: "not-found" as const };
      }

      if (entry.status !== "promoted") {
        return { state: "no-longer-available" as const };
      }

      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.waitlistEntryId, entry.id))
        .limit(1);

      if (!booking) {
        // promote always inserts a booking; if missing, treat as dead link
        // rather than leaking an internal error to a public claim page.
        return { state: "no-longer-available" as const };
      }

      const slot = {
        label: resolveSlotLabel(booking.slotId, booking.type),
        seats: booking.seats,
        totalFormatted: `€${(booking.totalAmount / 100).toFixed(2)}`,
        type: booking.type,
      };

      if (booking.status === "confirmed") {
        return {
          state: "already-paid" as const,
          entry,
          booking,
          slot,
        };
      }

      if (booking.status === "pending" || booking.status === "expired") {
        return {
          state: "ready-to-pay" as const,
          entry,
          booking,
          slot,
        };
      }

      // cancelled / failed — link is invalid
      return { state: "no-longer-available" as const };
    }),

  initPayment: publicProcedure
    .input(z.object({ waitlistEntryId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      const [entry] = await ctx.db
        .select()
        .from(waitlistEntries)
        .where(eq(waitlistEntries.id, input.waitlistEntryId))
        .limit(1);

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This offer could not be found.",
        });
      }

      if (entry.status !== "promoted") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This offer is no longer available.",
        });
      }

      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.waitlistEntryId, entry.id))
        .limit(1);

      if (!booking) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "We could not find a booking for this offer. Please contact support.",
        });
      }

      if (booking.status === "confirmed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This booking is already paid.",
        });
      }

      if (booking.status === "cancelled" || booking.status === "failed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This offer is no longer available.",
        });
      }

      const slotConfig =
        booking.type === "private-dining"
          ? (getDiningSessionById(booking.slotId)?.session ?? null)
          : (getWorkshopSlotById(booking.slotId)?.slot ?? null);

      if (!slotConfig) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Slot configuration not found for this booking.",
        });
      }

      const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      if (booking.status === "expired") {
        // Reviving the booking adds its seats back into the reserved
        // bucket, so re-check capacity under the slot lock with the same
        // warn-and-allow pattern as `promote`.
        await ctx.db.transaction(async (tx) => {
          await lockSlotForWrite(tx, booking.slotId);

          const breakdown = await getSlotSeatBreakdown(tx, {
            slotId: booking.slotId,
            capacity: slotConfig.capacity,
          });

          if (booking.seats > breakdown.available) {
            console.warn(
              `[waitlist.initPayment] Reviving ${booking.id} would exceed capacity for ${booking.slotId}: capacity=${slotConfig.capacity}, booked=${breakdown.booked}, reserved=${breakdown.reserved}, held=${breakdown.held}, adding=${booking.seats}. Proceeding (warn-and-allow).`,
            );
          }

          await tx
            .update(bookings)
            .set({
              status: "pending",
              expiresAt: newExpiresAt,
              paidAt: null,
              payablErrorCode: null,
              payablErrorMessage: null,
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, booking.id));
        });
      } else {
        // pending — customer is actively paying; just refresh the window.
        await ctx.db
          .update(bookings)
          .set({ expiresAt: newExpiresAt, updatedAt: new Date() })
          .where(eq(bookings.id, booking.id));
      }

      const urlReturn = `${clientEnv.NEXT_PUBLIC_APP_URL}/waitlist/claim?id=${entry.id}`;

      return initBookingPayment({
        database: ctx.db,
        booking: {
          id: booking.id,
          fullName: booking.fullName,
          email: booking.email,
          totalAmount: booking.totalAmount,
        },
        urlReturn,
        markFailedOnError: false,
        logTag: "waitlist.initPayment",
      });
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
