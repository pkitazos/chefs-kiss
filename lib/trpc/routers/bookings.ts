import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, inArray, lt, sql } from "drizzle-orm";
import { z } from "zod";

import { getDiningSessionById } from "@/lib/config/private-dining";
import { COMING_SOON } from "@/lib/config/mode";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { bookings, events } from "@/lib/db/schema";
import { sendBookingConfirmation } from "@/lib/email/booking-emails";
import { generateId } from "@/lib/utils/construct-id";
import { createBookingSchema } from "@/lib/validations/booking";
import { type Event } from "@/lib/validations/event";
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

      // Get active event
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

      // Expire stale pending bookings, then check capacity
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

      // Generate booking ID
      const eventForId: Event = {
        date: { start: activeEvent.startDate, end: activeEvent.endDate },
        location: activeEvent.location,
        locationCode: activeEvent.locationCode,
      };

      const [countResult] = await ctx.db
        .select({ count: count() })
        .from(bookings)
        .where(eq(bookings.eventId, activeEvent.id));
      const bookingNumber = (countResult?.count ?? 0) + 1;
      const bookingId = generateId(eventForId, bookingNumber, "BK");

      const totalAmount = slotConfig.price * input.seats * 100; // cents

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

      return { bookingId, paymentUrl: null };
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

  simulatePayment: publicProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (COMING_SOON) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Bookings are not open yet.",
        });
      }

      await expireStalePendingBookings(ctx.db);

      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking || booking.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Booking not found or not in pending status.",
        });
      }

      const paymentReference = `SIM-${Date.now()}`;

      const [updated] = await ctx.db
        .update(bookings)
        .set({
          status: "confirmed",
          paymentReference,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, input.bookingId))
        .returning();

      await sendBookingConfirmation({
        email: updated.email,
        fullName: updated.fullName,
        bookingId: updated.id,
        type: updated.type,
        seats: updated.seats,
        slotId: updated.slotId,
      });

      return { success: true, paymentReference };
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
    const result = getDiningSessionById(slotId);
    if (!result) return null;
    return { capacity: result.session.capacity, price: result.session.price };
  }

  const result = getWorkshopSlotById(slotId);
  if (!result) return null;
  return { capacity: result.slot.capacity, price: result.slot.price };
}

/** Expire all stale pending bookings (older than 15 min) in one UPDATE. */
async function expireStalePendingBookings(db: typeof import("@/lib/db").db) {
  await db
    .update(bookings)
    .set({ status: "expired", updatedAt: new Date() })
    .where(
      and(eq(bookings.status, "pending"), lt(bookings.expiresAt, new Date())),
    );
}
