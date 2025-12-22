import { createTRPCRouter, publicProcedure } from "../init";
import { vendorFormSchema } from "@/lib/validations/vendor-form";
import {
  vendorApplications,
  vendorDishes,
  vendorEmployees,
  vendorPowerRequirements,
  vendorTruckInfo,
} from "@/lib/db/schema/vendors";
import { sendVendorConfirmation } from "@/lib/email/vendor-emails";

export const vendorsRouter = createTRPCRouter({
  submitApplication: publicProcedure
    .input(vendorFormSchema)
    .mutation(async ({ input, ctx }) => {
      const applicationId = await ctx.db.transaction(async (tx) => {
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

        const [application] = await tx
          .insert(vendorApplications)
          .values({
            businessName: input.businessInfo.businessName,
            contactPerson: input.businessInfo.contactPerson,
            email: input.businessInfo.email,
            phoneNumber: input.businessInfo.phoneNumber,
            companyName: input.businessInfo.companyName,
            instagramHandle: input.businessInfo.instagramHandle ?? null,
            specialRequirements: input.specialRequirements.requirements ?? null,
            kitchenEquipment:
              input.specialRequirements.kitchenEquipment ?? null,
            storage: input.specialRequirements.storage ?? null,
            businessLicenseUrl: input.files.businessLicense,
            hygieneInspectionCertificationUrl:
              input.files.hygieneInspectionCertification,
            liabilityInsuranceUrl: input.files.liabilityInsurance,
            truckInfoId,
          })
          .returning({ id: vendorApplications.id });

        await tx.insert(vendorDishes).values(
          input.productsOffered.dishes.map((dish) => ({
            vendorApplicationId: application.id,
            name: dish.name,
            price: dish.price.toString(),
          }))
        );

        await tx.insert(vendorEmployees).values(
          input.files.employees.map((employee) => ({
            vendorApplicationId: application.id,
            name: employee.name,
            healthCertificateUrl: employee.healthCertificate,
            socialInsuranceUrl: employee.socialInsurance,
          }))
        );

        if (
          input.specialRequirements.powerSupply &&
          input.specialRequirements.powerSupply.length > 0
        ) {
          await tx.insert(vendorPowerRequirements).values(
            input.specialRequirements.powerSupply.map((power) => ({
              vendorApplicationId: application.id,
              device: power.device,
              wattage: power.wattage,
            }))
          );
        }

        return application.id;
      });

      await sendVendorConfirmation({
        email: input.businessInfo.email,
        contactPerson: input.businessInfo.contactPerson,
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
});
