import { desc, count, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { workshopCreationFormSchema } from "@/lib/validations/workshop-creation-form";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import {
  applicationStatusEnum,
  events,
  workshopApplications,
} from "@/lib/db/schema";
import { type Event } from "@/lib/validations/event";
import { generateId } from "@/lib/utils/construct-id";
import {
  sendWorkshopAcceptance,
  sendWorkshopConfirmation,
  sendWorkshopRejection,
} from "@/lib/email/workshop-emails";
import { z } from "zod";

export const workshopsRouter = createTRPCRouter({
  getAllApplications: protectedProcedure
    .input(z.object({ eventId: z.uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const baseQuery = ctx.db.select().from(workshopApplications);

      const applications = input?.eventId
        ? await baseQuery
            .where(eq(workshopApplications.eventId, input.eventId))
            .orderBy(desc(workshopApplications.createdAt))
        : await baseQuery.orderBy(desc(workshopApplications.createdAt));

      return applications;
    }),

  // Admin: Get single application by ID
  getApplicationById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(workshopApplications)

        .where(eq(workshopApplications.id, input.id));

      return row ?? null;
    }),

  // Admin: Update application status
  updateApplicationStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(applicationStatusEnum.enumValues),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(workshopApplications)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(workshopApplications.id, input.id))
        .returning();

      if (!updated) {
        throw new Error("Application not found");
      }

      const [event] = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, updated.eventId))
        .limit(1);

      // Send appropriate email based on status
      if (input.status === "approved") {
        await sendWorkshopAcceptance({
          email: updated.email,
          applicationId: updated.id,
          contactPerson: updated.contactPerson,
          workshopTitle: updated.workshopTitle,
          festivalDateRange: {
            startDate: event.startDate,
            endDate: event.endDate,
          },
        });
      } else if (input.status === "rejected") {
        await sendWorkshopRejection({
          email: updated.email,
          contactPerson: updated.contactPerson,
          reason: input.reason,
        });
      }

      return updated;
    }),

  submitApplication: publicProcedure
    .input(workshopCreationFormSchema)
    .mutation(async ({ ctx, input }) => {
      const [activeEvent] = await ctx.db
        .select()
        .from(events)
        .where(eq(events.isActive, true))
        .limit(1);

      if (!activeEvent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active event found. Applications are currently closed.",
        });
      }

      // Build Event object for ID generation
      const eventForId: Event = {
        date: {
          start: activeEvent.startDate,
          end: activeEvent.endDate,
        },
        location: activeEvent.location,
        locationCode: activeEvent.locationCode,
      };

      // Generate custom application ID (count only applications for this event)
      const [countResult] = await ctx.db
        .select({ count: count() })
        .from(workshopApplications)
        .where(eq(workshopApplications.eventId, activeEvent.id));
      const applicationNumber = (countResult?.count ?? 0) + 1;
      const applicationId = generateId(eventForId, applicationNumber, "WS");

      await ctx.db.insert(workshopApplications).values({
        id: applicationId,
        eventId: activeEvent.id,
        contactPerson: input.contactDetails.contactPerson,
        email: input.contactDetails.email,
        phoneNumber: input.contactDetails.phoneNumber,
        instagramHandle: input.contactDetails.instagramHandle,
        workshopTitle: input.generalInfo.title,
        workshopDescription: input.generalInfo.description,
        contentOutline: input.contentOutline,
        sessionDuration: input.sessionDetails.duration,
        participantsPerSession: input.sessionDetails.participantsPerSession,
        sessionsPerDay: input.sessionDetails.sessionsPerDay,
        materialsAndTools: input.materialsAndTools,
        targetAudience: input.targetAudience,
        preferredParticipation: input.preferredParticipation,
      });

      await sendWorkshopConfirmation({
        email: input.contactDetails.email,
        contactPerson: input.contactDetails.contactPerson,
        workshopTitle: input.generalInfo.title,
        applicationId,
      });

      return {
        success: true,
        applicationId,
        message:
          "Your workshop application has been submitted successfully. You will receive a confirmation email shortly.",
      };
    }),
});
