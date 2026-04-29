import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { COMING_SOON } from "@/lib/config/mode";
import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { expireStalePendingBookings } from "@/lib/db/expire-stale-bookings";
import { bookings, events } from "@/lib/db/schema";
import {
  buildNotificationUrl,
  buildReturnUrl,
  initPayablTransaction,
} from "@/lib/payments/payabl";
import {
  buildBookingOrWaitlistRef,
  categoryFromSlotId,
  refLikePatternForCategory,
} from "@/lib/ids";
import { createBookingSchema } from "@/lib/validations/booking";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";

export const bookingsRouter = createTRPCRouter({
  create: publicProcedure
    .input(createBookingSchema)
    .mutation(async ({ ctx, input }) => {
      if (COMING_SOON) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Bookings are not open yet.",
        });
      }

      const slotConfig = getSlotConfig(input.slotId, input.type);
      if (!slotConfig) {
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

      await expireStalePendingBookings(ctx.db);

      const [booked] = await ctx.db
        .select({ total: sql<number>`coalesce(sum(${bookings.seats}), 0)` })
        .from(bookings)
        .where(
          and(
            eq(bookings.slotId, input.slotId),
            inArray(bookings.status, ["confirmed", "pending"]),
          ),
        );

      const bookedSeats = Number(booked?.total ?? 0);
      const remaining = slotConfig.capacity - bookedSeats;

      if (input.seats > remaining) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            remaining === 0
              ? "This slot is fully booked."
              : `Only ${remaining} seat(s) remaining.`,
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
      const refPattern = refLikePatternForCategory(year, "BK", category);

      const [countResult] = await ctx.db
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

      const totalAmount = slotConfig.price * input.seats * 100; // cents

      // Insert the pending row first so every attempt produces an audit trail.
      await ctx.db.insert(bookings).values({
        id: bookingId,
        type: input.type,
        slotId: input.slotId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        seats: input.seats,
        totalAmount,
        browserSessionId: input.browserSessionId ?? null,
        eventId: activeEvent.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      // Kick off the payabl init. Two failure modes handled separately:
      //   - Network/exceptional failure (fetch throws): mark the booking
      //     failed and surface as INTERNAL_SERVER_ERROR so the frontend
      //     can show a "please try again" message.
      //   - Payabl returned errorcode != 0: mark the booking failed with
      //     the provided code/message; frontend still redirects to the
      //     status page which will show the failure.
      const [firstName, ...restName] = input.fullName.trim().split(/\s+/);
      const lastName = restName.join(" ") || firstName;

      // Determine the return URL based on booking type
      // Append the booking ref to the return URL so the status page can
      // pick it up from the search params.
      const url_return =
        input.type === "workshop"
          ? `${buildReturnUrl("workshop", input.workshopSlug)}?ref=${bookingId}`
          : `${buildReturnUrl("private-dining", null)}?ref=${bookingId}`;

      try {
        const initResult = await initPayablTransaction({
          amount: (totalAmount / 100).toFixed(2), // cents -> "50.00"
          currency: "EUR",
          orderid: bookingId,
          firstname: firstName,
          lastname: lastName,
          email: input.email,
          notification_url: buildNotificationUrl(bookingId),
          url_return,
        });

        if (!initResult.ok) {
          console.warn(
            `[bookings.create] payabl init failed for ${bookingId}: ${initResult.errorcode} ${initResult.errormessage}`,
          );

          await ctx.db
            .update(bookings)
            .set({
              status: "failed",
              payablErrorCode: initResult.errorcode,
              payablErrorMessage: initResult.errormessage || null,
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, bookingId));

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Could not initiate payment. Please try again or contact support.",
          });
        }

        // Persist the payabl transactionid so we have a back-reference
        // before the user even completes payment.
        await ctx.db
          .update(bookings)
          .set({
            payablTransactionId: initResult.transactionid,
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, bookingId));

        return { bookingId, paymentUrl: initResult.start_url };
      } catch (err) {
        // If this is already a TRPCError we threw above, rethrow as-is.
        if (err instanceof TRPCError) throw err;

        // Otherwise it's a network/fetch exception. Mark failed for the
        // audit trail, then surface.
        console.error(
          `[bookings.create] payabl init threw for ${bookingId}:`,
          err instanceof Error ? err.message : err,
        );

        await ctx.db
          .update(bookings)
          .set({
            status: "failed",
            payablErrorMessage: "Payment provider unreachable",
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, bookingId));

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Could not reach payment provider. Please try again in a moment.",
        });
      }
    }),

  checkOverlaps: publicProcedure
    .input(
      z.object({
        browserSessionId: z.string(),
        slotId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      // Find confirmed/pending workshop bookings for this browser session
      const existingBookings = await ctx.db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.browserSessionId, input.browserSessionId),
            eq(bookings.type, "workshop"),
            inArray(bookings.status, ["confirmed", "pending"]),
          ),
        );

      if (existingBookings.length === 0) return { conflicts: [] };

      // Check if any existing bookings overlap with the requested slot
      const requestedSlot = getWorkshopSlotById(input.slotId);
      if (!requestedSlot) return { conflicts: [] };

      const conflicts: { title: string; time: string }[] = [];

      for (const booking of existingBookings) {
        if (booking.slotId === input.slotId) continue;
        const existingSlot = getWorkshopSlotById(booking.slotId);
        if (!existingSlot) continue;

        // Same date check — compare day
        const sameDay =
          existingSlot.day.date.getTime() === requestedSlot.day.date.getTime();
        if (sameDay) {
          // Simple time overlap check — if they're on the same day,
          // flag it and let the user decide
          conflicts.push({
            title: existingSlot.workshop.title,
            time: existingSlot.slot.time,
          });
        }
      }

      return { conflicts };
    }),

  getStatus: publicProcedure
    .input(z.object({ bookingId: z.string() }))
    .query(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) return null;

      return booking;
    }),

  getSlotAvailability: publicProcedure
    .input(z.object({ slotId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Try to find slot in either config
      const dining = getDiningSessionById(input.slotId);
      const workshop = getWorkshopSlotById(input.slotId);
      const capacity = dining
        ? dining.session.capacity
        : workshop
          ? workshop.slot.capacity
          : null;

      if (capacity === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid slot ID.",
        });
      }

      await expireStalePendingBookings(ctx.db);

      const [result] = await ctx.db
        .select({ total: sql<number>`coalesce(sum(${bookings.seats}), 0)` })
        .from(bookings)
        .where(
          and(
            eq(bookings.slotId, input.slotId),
            inArray(bookings.status, ["confirmed", "pending"]),
          ),
        );

      const booked = Number(result?.total ?? 0);

      return { capacity, booked, remaining: capacity - booked };
    }),

  markPaid: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.id))
        .limit(1);

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found.",
        });
      }

      if (booking.paymentMethod !== "in-person") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only in-person bookings can be marked as paid.",
        });
      }

      if (booking.paidAt !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Booking is already marked as paid.",
        });
      }

      const [updated] = await ctx.db
        .update(bookings)
        .set({ paidAt: new Date(), updatedAt: new Date() })
        .where(eq(bookings.id, input.id))
        .returning();

      return updated;
    }),

  adminList: protectedProcedure
    .input(
      z
        .object({
          type: z.enum(["private-dining", "workshop"]).optional(),
          status: z
            .enum(["pending", "confirmed", "failed", "expired"])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      const conditions = [];

      if (input?.type) {
        conditions.push(eq(bookings.type, input.type));
      }
      if (input?.status) {
        conditions.push(eq(bookings.status, input.status));
      }

      const result = await ctx.db
        .select()
        .from(bookings)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(bookings.createdAt));

      return result;
    }),
});

function getSlotConfig(slotId: string, type: "private-dining" | "workshop") {
  if (type === "private-dining") {
    const result = getDiningSessionById(slotId); // returns  { day: DiningDay; session: DiningSession; } | null
    if (!result) return null;
    return { capacity: result.session.capacity, price: result.session.price };
  }

  const result = getWorkshopSlotById(slotId); // returns  { day: WorkshopDay; slot: WorkshopSlot; } | null
  if (!result) return null;
  return { capacity: result.slot.capacity, price: result.slot.price };
}
