import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { getCurrentCheckInStateForBookings } from "@/lib/check-in/state";
import { bookings } from "@/lib/db/schema";
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
});
