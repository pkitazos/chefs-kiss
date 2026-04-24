import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { expireStalePendingBookings } from "@/lib/db/expire-stale-bookings";
import { bookings, waitlistEntries } from "@/lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const slotsRouter = createTRPCRouter({
  summary: protectedProcedure.query(async ({ ctx }) => {
    await expireStalePendingBookings(ctx.db);

    const bookedRows = await ctx.db
      .select({
        slotId: bookings.slotId,
        type: bookings.type,
        booked: sql<number>`coalesce(sum(${bookings.seats}), 0)`,
      })
      .from(bookings)
      .where(inArray(bookings.status, ["confirmed", "pending"]))
      .groupBy(bookings.slotId, bookings.type);

    const waitlistRows = await ctx.db
      .select({
        slotId: waitlistEntries.slotId,
        type: waitlistEntries.type,
        waitlist: count(),
      })
      .from(waitlistEntries)
      .where(eq(waitlistEntries.status, "waiting"))
      .groupBy(waitlistEntries.slotId, waitlistEntries.type);

    type Summary = {
      slotId: string;
      type: "private-dining" | "workshop";
      booked: number;
      waitlist: number;
    };

    const summaryBySlot = new Map<string, Summary>();

    for (const row of bookedRows) {
      summaryBySlot.set(row.slotId, {
        slotId: row.slotId,
        type: row.type,
        booked: Number(row.booked),
        waitlist: 0,
      });
    }

    for (const row of waitlistRows) {
      const existing = summaryBySlot.get(row.slotId);
      if (existing) {
        existing.waitlist = Number(row.waitlist);
      } else {
        summaryBySlot.set(row.slotId, {
          slotId: row.slotId,
          type: row.type,
          booked: 0,
          waitlist: Number(row.waitlist),
        });
      }
    }

    return Array.from(summaryBySlot.values());
  }),

  bySlot: protectedProcedure
    .input(z.object({ slotId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      const slotBookings = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.slotId, input.slotId))
        .orderBy(desc(bookings.createdAt));

      const slotWaitlist = await ctx.db
        .select()
        .from(waitlistEntries)
        .where(eq(waitlistEntries.slotId, input.slotId))
        .orderBy(asc(waitlistEntries.createdAt));

      const [bookedSeatsResult] = await ctx.db
        .select({ total: sql<number>`coalesce(sum(${bookings.seats}), 0)` })
        .from(bookings)
        .where(
          and(
            eq(bookings.slotId, input.slotId),
            inArray(bookings.status, ["confirmed", "pending"]),
          ),
        );

      const bookedSeats = Number(bookedSeatsResult?.total ?? 0);
      const waitlistCount = slotWaitlist.filter(
        (w) => w.status === "waiting",
      ).length;

      return {
        bookings: slotBookings,
        waitlist: slotWaitlist,
        bookedSeats,
        waitlistCount,
      };
    }),
});
