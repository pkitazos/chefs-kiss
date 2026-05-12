import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { COMING_SOON } from "@/lib/config/mode";
import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { expireStalePendingBookings } from "@/lib/db/expire-stale-bookings";
import {
  CapacityExceededError,
  insertPendingBooking,
} from "@/lib/db/insert-pending-booking";
import { bookings, events, seatHolds } from "@/lib/db/schema";
import { getSlotSeatBreakdown } from "@/lib/db/seat-counting";
import { lockSlotForWrite } from "@/lib/db/seat-locks";
import {
  sendBookingCancellation,
  sendBookingConfirmation,
} from "@/lib/email/booking-emails";
import { sendWaitlistPaymentConfirmation } from "@/lib/email/waitlist-emails";
import { categoryFromSlotId, refLikePatternForCategory } from "@/lib/ids";
import { initBookingPayment } from "@/lib/payments/init-booking-payment";
import { buildReturnUrl } from "@/lib/payments/payabl";
import { createBookingSchema } from "@/lib/validations/booking";
import {
  createTRPCRouter,
  permissionProcedure,
  publicProcedure,
} from "../init";

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

      const category = categoryFromSlotId(input.slotId);
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not derive category from slot ID.",
        });
      }

      const year = activeEvent.startDate.getFullYear();
      const refPattern = refLikePatternForCategory(year, "BK", category);
      const totalAmount = slotConfig.price * input.seats * 100; // cents

      let bookingId: string;
      try {
        bookingId = await insertPendingBooking(ctx.db, {
          slotId: input.slotId,
          capacity: slotConfig.capacity,
          seats: input.seats,
          type: input.type,
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          browserSessionId: input.browserSessionId ?? null,
          totalAmount,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          eventId: activeEvent.id,
          refPattern,
          year,
          category,
          locationCode: activeEvent.locationCode,
        });
      } catch (err) {
        if (err instanceof CapacityExceededError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err.message,
          });
        }
        console.error("[bookings.create] failed to insert booking:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Something went wrong creating your booking. Please try again.",
        });
      }

      // Append the booking ref to the return URL so the status page can
      // pick it up from the search params.
      const urlReturn =
        input.type === "workshop"
          ? `${buildReturnUrl("workshop", input.workshopSlug)}?ref=${bookingId}`
          : `${buildReturnUrl("private-dining", null)}?ref=${bookingId}`;

      const { paymentUrl } = await initBookingPayment({
        database: ctx.db,
        booking: {
          id: bookingId,
          fullName: input.fullName,
          email: input.email,
          totalAmount,
        },
        urlReturn,
        markFailedOnError: true,
        logTag: "bookings.create",
      });

      return { bookingId, paymentUrl };
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

      // ! This is a public endpoint and the response includes the full
      // bucket breakdown (booked, reserved, held). The customer UI only
      // renders `available`, but anyone with the slot id can read all
      // four numbers off the wire. Acceptable for our low-stakes data,
      // but if this endpoint ever surfaces sensitive operational counts
      // it needs trimming server-side.
      return getSlotSeatBreakdown(ctx.db, {
        slotId: input.slotId,
        capacity,
      });
    }),

  updateName: permissionProcedure("admin.access")
    .input(
      z.object({
        bookingId: z.string().min(1),
        fullName: z.string().trim().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(bookings)
        .set({ fullName: input.fullName, updatedAt: new Date() })
        .where(eq(bookings.id, input.bookingId))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found.",
        });
      }

      return updated;
    }),

  resendConfirmation: permissionProcedure("admin.access")
    .input(z.object({ bookingId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found.",
        });
      }

      if (booking.status !== "confirmed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Can only resend confirmation for confirmed bookings (current status: ${booking.status}).`,
        });
      }

      const isWaitlist = booking.waitlistEntryId !== null;
      const sendConfirmation = isWaitlist
        ? sendWaitlistPaymentConfirmation
        : sendBookingConfirmation;

      // debug("resendConfirmation", `sending to ${booking.email}`, {
      //   bookingId: booking.id,
      //   isWaitlist,
      //   status: booking.status,
      //   slotId: booking.slotId,
      // });

      try {
        const result = await sendConfirmation({
          email: booking.email,
          fullName: booking.fullName,
          bookingId: booking.id,
          type: booking.type,
          seats: booking.seats,
          slotId: booking.slotId,
        });

        // debug("resendConfirmation", `email result`, result);

        if (!result.success) {
          throw new Error("Email send returned failure");
        }
      } catch (err) {
        // debug(
        //   "resendConfirmation",
        //   `error`,
        //   err instanceof Error ? err.message : err,
        // );
        console.error("[bookings.resendConfirmation] email send failed:", {
          bookingId: booking.id,
          email: booking.email,
          err,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Could not send confirmation email — try again or check logs.",
        });
      }

      await ctx.db
        .update(bookings)
        .set({ confirmationEmailSentAt: new Date(), updatedAt: new Date() })
        .where(eq(bookings.id, input.bookingId));
    }),

  cancel: permissionProcedure("admin.access")
    .input(
      z.object({
        id: z.string().min(1),
        note: z
          .string()
          .trim()
          .max(500)
          .optional()
          .transform((v) => (v && v.length > 0 ? v : undefined)),
        sendEmail: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const adminUserId = ctx.session.user.id;

      const result = await ctx.db.transaction(async (tx) => {
        const [booking] = await tx
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

        if (booking.status !== "pending" && booking.status !== "confirmed") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Only pending or confirmed bookings can be cancelled (current status: ${booking.status}).`,
          });
        }

        await lockSlotForWrite(tx, booking.slotId);

        const [updated] = await tx
          .update(bookings)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(bookings.id, input.id))
          .returning();

        const noteValue = input.note ?? `From cancelled booking ${booking.id}`;

        await tx.insert(seatHolds).values({
          id: crypto.randomUUID(),
          slotId: booking.slotId,
          seatCount: booking.seats,
          status: "active",
          note: noteValue,
          createdBy: adminUserId,
          eventId: booking.eventId,
        });

        return { booking: updated, previousStatus: booking.status };
      });

      if (input.sendEmail) {
        try {
          await sendBookingCancellation({
            email: result.booking.email,
            fullName: result.booking.fullName,
            bookingId: result.booking.id,
            type: result.booking.type,
            seats: result.booking.seats,
            slotId: result.booking.slotId,
          });
        } catch (err) {
          console.error("Failed to send booking cancellation email:", {
            bookingId: result.booking.id,
            email: result.booking.email,
            err,
          });
        }
      }

      return result.booking;
    }),

  adminList: permissionProcedure("admin.access")
    .input(
      z
        .object({
          type: z.enum(["private-dining", "workshop"]).optional(),
          status: z
            .enum(["pending", "confirmed", "failed", "expired", "cancelled"])
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
