import { and, asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { expireStalePendingBookings } from "@/lib/db/expire-stale-bookings";
import {
  getAllSlotsSeatCounts,
  getSlotSeatCounts,
} from "@/lib/db/seat-counting";
import { bookings, seatHolds, user, waitlistEntries } from "@/lib/db/schema";
import { createTRPCRouter, permissionProcedure } from "../init";

export const slotsRouter = createTRPCRouter({
  summary: permissionProcedure("admin.access").query(async ({ ctx }) => {
    await expireStalePendingBookings(ctx.db);

    const seatCounts = await getAllSlotsSeatCounts(ctx.db);

    const waitlistRows = await ctx.db
      .select({
        slotId: waitlistEntries.slotId,
        waitlist: count(),
      })
      .from(waitlistEntries)
      .where(eq(waitlistEntries.status, "waiting"))
      .groupBy(waitlistEntries.slotId);

    type Summary = {
      slotId: string;
      booked: number;
      reserved: number;
      held: number;
      waitlist: number;
    };

    const summaryBySlot = new Map<string, Summary>();

    for (const [slotId, counts] of seatCounts) {
      summaryBySlot.set(slotId, {
        slotId,
        booked: counts.booked,
        reserved: counts.reserved,
        held: counts.held,
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
          booked: 0,
          reserved: 0,
          held: 0,
          waitlist: Number(row.waitlist),
        });
      }
    }

    return Array.from(summaryBySlot.values());
  }),

  bySlot: permissionProcedure("admin.access")
    .input(z.object({ slotId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      await expireStalePendingBookings(ctx.db);

      const slotBookings = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.slotId, input.slotId))
        .orderBy(desc(bookings.createdAt));

      const waitlistRows = await ctx.db
        .select()
        .from(waitlistEntries)
        .leftJoin(bookings, eq(bookings.waitlistEntryId, waitlistEntries.id))
        .where(eq(waitlistEntries.slotId, input.slotId))
        .orderBy(asc(waitlistEntries.createdAt));

      const slotWaitlist = waitlistRows.map((row) => ({
        ...row.waitlist_entries,
        booking: row.bookings
          ? {
              id: row.bookings.id,
              status: row.bookings.status,
              paidAt: row.bookings.paidAt,
            }
          : null,
      }));

      const activeHoldRows = await ctx.db
        .select({
          id: seatHolds.id,
          slotId: seatHolds.slotId,
          seatCount: seatHolds.seatCount,
          note: seatHolds.note,
          createdAt: seatHolds.createdAt,
          createdBy: seatHolds.createdBy,
          creatorName: user.name,
          creatorEmail: user.email,
        })
        .from(seatHolds)
        .leftJoin(user, eq(user.id, seatHolds.createdBy))
        .where(
          and(
            eq(seatHolds.slotId, input.slotId),
            eq(seatHolds.status, "active"),
          ),
        )
        .orderBy(desc(seatHolds.createdAt));

      const counts = await getSlotSeatCounts(ctx.db, input.slotId);

      const waitlistCount = slotWaitlist.filter(
        (w) => w.status === "waiting",
      ).length;

      return {
        bookings: slotBookings,
        waitlist: slotWaitlist,
        holds: activeHoldRows,
        counts,
        waitlistCount,
      };
    }),
});
