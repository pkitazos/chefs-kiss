import { workshopApplications } from "@/lib/db/schema";
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

    const vendorData = await ctx.db
      .select({
        status: vendorApplications.status,
        count: count(),
      })
      .from(vendorApplications)
      .where(eq(vendorApplications.eventId, activeEvent.id))
      .groupBy(vendorApplications.status);

    const vendorStats = {
      total: vendorData.reduce((acc, s) => acc + Number(s.count), 0),
      pending:
        Number(vendorData.find((s) => s.status === "pending")?.count) || 0,
      approved:
        Number(vendorData.find((s) => s.status === "approved")?.count) || 0,
      rejected:
        Number(vendorData.find((s) => s.status === "rejected")?.count) || 0,
    };

    const workshopData = await ctx.db
      .select({
        status: workshopApplications.status,
        count: count(),
      })
      .from(workshopApplications)
      .where(eq(workshopApplications.eventId, activeEvent.id))
      .groupBy(workshopApplications.status);

    const workshopStats = {
      total: workshopData.reduce((acc, s) => acc + Number(s.count), 0),
      pending:
        Number(workshopData.find((s) => s.status === "pending")?.count) || 0,
      approved:
        Number(workshopData.find((s) => s.status === "approved")?.count) || 0,
      rejected:
        Number(workshopData.find((s) => s.status === "rejected")?.count) || 0,
    };

    return {
      event: activeEvent,
      vendorStats,
      workshopStats,
    };
  }),
});
