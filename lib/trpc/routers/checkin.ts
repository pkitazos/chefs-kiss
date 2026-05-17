import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { getCurrentCheckInStateForBookings } from "@/lib/check-in/state";
import { bookings, seatHolds } from "@/lib/db/schema";
import { createTRPCRouter, permissionProcedure } from "../init";

export const checkinRouter = createTRPCRouter({
  getSlotBookings: permissionProcedure("check_in.access")
    .input(z.object({ slotId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const slotBookings = await ctx.db
        .select({
          id: bookings.id,
          fullName: bookings.fullName,
          email: bookings.email,
          seats: bookings.seats,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.slotId, input.slotId),
            eq(bookings.status, "confirmed"),
          ),
        )
        .orderBy(asc(bookings.createdAt));

      if (slotBookings.length === 0) return [];

      const states = await getCurrentCheckInStateForBookings(
        ctx.db,
        slotBookings.map((b) => b.id),
      );

      return slotBookings.map((booking) => ({
        ...booking,
        isCheckedIn: states.get(booking.id)?.isCheckedIn ?? false,
      }));
    }),

  getSlotHolds: permissionProcedure("check_in.access")
    .input(z.object({ slotId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: seatHolds.id,
          seatCount: seatHolds.seatCount,
          note: seatHolds.note,
          checkedInAt: seatHolds.checkedInAt,
        })
        .from(seatHolds)
        .where(
          and(
            eq(seatHolds.slotId, input.slotId),
            eq(seatHolds.status, "active"),
          ),
        )
        .orderBy(asc(seatHolds.createdAt));
    }),

  toggleHoldCheckIn: permissionProcedure("check_in.access")
    .input(z.object({ holdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [hold] = await ctx.db
        .select({ checkedInAt: seatHolds.checkedInAt })
        .from(seatHolds)
        .where(
          and(
            eq(seatHolds.id, input.holdId),
            eq(seatHolds.status, "active"),
          ),
        )
        .limit(1);

      if (!hold) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Active seat hold not found.",
        });
      }

      const now = new Date();
      const [updated] = await ctx.db
        .update(seatHolds)
        .set({
          checkedInAt: hold.checkedInAt ? null : now,
          updatedAt: now,
        })
        .where(eq(seatHolds.id, input.holdId))
        .returning({
          id: seatHolds.id,
          checkedInAt: seatHolds.checkedInAt,
        });

      return { id: updated.id, isCheckedIn: updated.checkedInAt !== null };
    }),
});
