import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { vendorFormSchema } from "@/lib/validations/vendor-form";
import { eventSchema, type Event } from "@/lib/validations/event";
import {
  applicationStatusEnum,
  vendorApplications,
  vendorDishes,
  vendorEmployees,
  vendorPowerRequirements,
  vendorTruckInfo,
} from "@/lib/db/schema/vendors";
import {
  sendVendorAcceptance,
  sendVendorConfirmation,
  sendVendorRejection,
} from "@/lib/email/vendor-emails";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "@/lib/utils/construct-id";

// TODO: Move to configuration/database when supporting multiple events
const CURRENT_EVENT: Event = {
  date: {
    start: new Date("2026-04-15"),
    end: new Date("2026-04-17"),
  },
  location: "Ayia Napa Marina",
  locationCode: "ANM",
};

export const vendorsRouter = createTRPCRouter({
  // Admin: Get all applications with related data
  getAllApplications: protectedProcedure.query(async ({ ctx }) => {
    const applications = await ctx.db
      .select()
      .from(vendorApplications)
      .leftJoin(
        vendorTruckInfo,
        eq(vendorApplications.truckInfoId, vendorTruckInfo.id),
      )
      .orderBy(desc(vendorApplications.createdAt));

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
            eq(vendorEmployees.vendorApplicationId, row.vendor_applications.id),
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
      // Generate custom application ID
      const [countResult] = await ctx.db
        .select({ count: count() })
        .from(vendorApplications);
      const applicationNumber = (countResult?.count ?? 0) + 1;
      const applicationId = generateId(CURRENT_EVENT, applicationNumber, "VE");

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
          "Your application has been submitted successfully. You will receive a confirmation email shortly.",
      };
    }),

  // Admin: Generate a new vendor application ID
  generateApplicationId: protectedProcedure
    .input(eventSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select({ count: count() })
        .from(vendorApplications);

      const applicationNumber = (result?.count ?? 0) + 1;

      return generateId(input, applicationNumber, "VE");
    }),
});
