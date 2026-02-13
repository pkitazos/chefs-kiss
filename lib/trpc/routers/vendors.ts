import { TRPCError } from "@trpc/server";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  applicationStatusEnum,
  events,
  vendorApplications,
  vendorDishes,
  vendorEmployees,
  vendorPowerRequirements,
  vendorTruckInfo,
} from "@/lib/db/schema/";
import {
  sendVendorAcceptance,
  sendVendorConfirmation,
  sendVendorRejection,
} from "@/lib/email/vendor-emails";
import { generateId } from "@/lib/utils/construct-id";
import { type Event } from "@/lib/validations/event";
import { vendorFormSchema } from "@/lib/validations/vendor-form";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";

export const vendorsRouter = createTRPCRouter({
  // Admin: Get all applications with related data (optionally filtered by event)
  getAllApplications: protectedProcedure
    .input(z.object({ eventId: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const baseQuery = ctx.db
        .select()
        .from(vendorApplications)
        .leftJoin(
          vendorTruckInfo,
          eq(vendorApplications.truckInfoId, vendorTruckInfo.id),
        );

      const applications = input?.eventId
        ? await baseQuery
            .where(eq(vendorApplications.eventId, input.eventId))
            .orderBy(desc(vendorApplications.createdAt))
        : await baseQuery.orderBy(desc(vendorApplications.createdAt));

      const result = await Promise.all(
        applications.map(async (row) => {
          const dishes = await ctx.db
            .select()
            .from(vendorDishes)
            .where(
              eq(vendorDishes.vendorApplicationId, row.vendor_applications.id),
            );

          const employees = await ctx.db
            .select()
            .from(vendorEmployees)
            .where(
              eq(
                vendorEmployees.vendorApplicationId,
                row.vendor_applications.id,
              ),
            );

          const powerRequirements = await ctx.db
            .select()
            .from(vendorPowerRequirements)
            .where(
              eq(
                vendorPowerRequirements.vendorApplicationId,
                row.vendor_applications.id,
              ),
            );

          return {
            ...row.vendor_applications,
            truckInfo: row.vendor_truck_info,
            dishes,
            employees,
            powerRequirements,
          };
        }),
      );

      return result;
    }),

  // Admin: Get single application by ID
  getApplicationById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(vendorApplications)
        .leftJoin(
          vendorTruckInfo,
          eq(vendorApplications.truckInfoId, vendorTruckInfo.id),
        )
        .where(eq(vendorApplications.id, input.id));

      if (!row) {
        return null;
      }

      const dishes = await ctx.db
        .select()
        .from(vendorDishes)
        .where(eq(vendorDishes.vendorApplicationId, input.id));

      const employees = await ctx.db
        .select()
        .from(vendorEmployees)
        .where(eq(vendorEmployees.vendorApplicationId, input.id));

      const powerRequirements = await ctx.db
        .select()
        .from(vendorPowerRequirements)
        .where(eq(vendorPowerRequirements.vendorApplicationId, input.id));

      return {
        ...row.vendor_applications,
        truckInfo: row.vendor_truck_info,
        dishes,
        employees,
        powerRequirements,
      };
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
        .update(vendorApplications)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(vendorApplications.id, input.id))
        .returning();

      if (!updated) {
        throw new Error("Application not found");
      }

      // Send appropriate email based on status
      if (input.status === "approved") {
        await sendVendorAcceptance({
          email: updated.email,
          businessName: updated.businessName,
          applicationId: updated.id,
        });
      } else if (input.status === "rejected") {
        await sendVendorRejection({
          email: updated.email,
          businessName: updated.businessName,
          reason: input.reason,
        });
      }

      return updated;
    }),

  submitApplication: publicProcedure
    .input(vendorFormSchema)
    .mutation(async ({ input, ctx }) => {
      // Get the active event from database
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
        .from(vendorApplications)
        .where(eq(vendorApplications.eventId, activeEvent.id));
      const applicationNumber = (countResult?.count ?? 0) + 1;
      const applicationId = generateId(eventForId, applicationNumber, "VE");

      await ctx.db.transaction(async (tx) => {
        let truckInfoId: string | null = null;
        if (input.truck.ownTruck) {
          const [truckInfo] = await tx
            .insert(vendorTruckInfo)
            .values({
              photoUrl: input.truck.truckPhotoUrl!,
              length: input.truck.truckDimensions!.length!.toString(),
              width: input.truck.truckDimensions!.width!.toString(),
              height: input.truck.truckDimensions!.height!.toString(),
              electroMechanicalLicenseUrl:
                input.truck.electroMechanicalLicenseUrl!,
            })
            .returning({ id: vendorTruckInfo.id });
          truckInfoId = truckInfo.id;
        }

        await tx.insert(vendorApplications).values({
          id: applicationId,
          eventId: activeEvent.id,
          businessName: input.businessInfo.businessName,
          contactPerson: input.businessInfo.contactPerson,
          email: input.businessInfo.email,
          phoneNumber: input.businessInfo.phoneNumber,
          companyName: input.businessInfo.companyName,
          instagramHandle: input.businessInfo.instagramHandle ?? null,
          specialRequirements: input.specialRequirements.requirements ?? null,
          kitchenEquipment: input.specialRequirements.kitchenEquipment ?? null,
          storage: input.specialRequirements.storage ?? null,
          businessLicenseUrl: input.files.businessLicense,
          hygieneInspectionCertificationUrl:
            input.files.hygieneInspectionCertification,
          liabilityInsuranceUrl: input.files.liabilityInsurance,
          truckInfoId,
        });

        await tx.insert(vendorDishes).values(
          input.productsOffered.dishes.map((dish) => ({
            vendorApplicationId: applicationId,
            name: dish.name,
            price: dish.price.toString(),
          })),
        );

        await tx.insert(vendorEmployees).values(
          input.files.employees.map((employee) => ({
            vendorApplicationId: applicationId,
            name: employee.name,
            healthCertificateUrl: employee.healthCertificate,
            socialInsuranceUrl: employee.socialInsurance,
          })),
        );

        if (
          input.specialRequirements.powerSupply &&
          input.specialRequirements.powerSupply.length > 0
        ) {
          await tx.insert(vendorPowerRequirements).values(
            input.specialRequirements.powerSupply.map((power) => ({
              vendorApplicationId: applicationId,
              device: power.device,
              wattage: power.wattage,
            })),
          );
        }
      });

      await sendVendorConfirmation({
        email: input.businessInfo.email,
        businessName: input.businessInfo.businessName,
        applicationId,
      });

      return {
        success: true,
        applicationId,
        message:
          "Your vendor application has been submitted successfully. You will receive a confirmation email shortly.",
      };
    }),
});
