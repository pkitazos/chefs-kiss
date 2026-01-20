import { createTRPCRouter, protectedProcedure } from "../init";
import { events } from "@/lib/db/schema/events";
import { vendorApplications } from "@/lib/db/schema/vendors";
import { desc, eq, count } from "drizzle-orm";

export const eventsRouter = createTRPCRouter({
  // Get the currently active event
  getActiveEvent: protectedProcedure.query(async ({ ctx }) => {
    const [activeEvent] = await ctx.db
      .select()
      .from(events)
      .where(eq(events.isActive, true))
      .limit(1);

    return activeEvent ?? null;
  }),

  // Get all events (past, present, future)
  getAllEvents: protectedProcedure.query(async ({ ctx }) => {
    const allEvents = await ctx.db
      .select()
      .from(events)
      .orderBy(desc(events.startDate));

    return allEvents;
  }),

  // Get dashboard stats for active event
  getActiveEventStats: protectedProcedure.query(async ({ ctx }) => {
    const [activeEvent] = await ctx.db
      .select()
      .from(events)
      .where(eq(events.isActive, true))
      .limit(1);

    if (!activeEvent) {
      return { event: null, stats: null };
    }

    const stats = await ctx.db
      .select({
        status: vendorApplications.status,
        count: count(),
      })
      .from(vendorApplications)
      .where(eq(vendorApplications.eventId, activeEvent.id))
      .groupBy(vendorApplications.status);

    const totalApplications = stats.reduce(
      (acc, s) => acc + Number(s.count),
      0,
    );
    const pendingCount =
      Number(stats.find((s) => s.status === "pending")?.count) || 0;
    const approvedCount =
      Number(stats.find((s) => s.status === "approved")?.count) || 0;
    const rejectedCount =
      Number(stats.find((s) => s.status === "rejected")?.count) || 0;

    return {
      event: activeEvent,
      stats: {
        total: totalApplications,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    };
  }),
});
