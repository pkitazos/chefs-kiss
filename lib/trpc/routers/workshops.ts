import { count, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { workshopCreationFormSchema } from "@/lib/validations/workshop-creation-form";
import { createTRPCRouter, publicProcedure } from "../init";
import { events, workshopApplications } from "@/lib/db/schema";
import { type Event } from "@/lib/validations/event";
import { generateId } from "@/lib/utils/construct-id";
import { sendWorkshopConfirmation } from "@/lib/email/workshop-emails";

export const workshopsRouter = createTRPCRouter({
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
