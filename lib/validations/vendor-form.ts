import { z } from "zod";

export const vendorFormSchema = z
  .object({
    businessInfo: z.object({
      businessName: z
        .string()
        .min(1, "Business name is required")
        .describe(
          "The name of your restaurant, brand or food business as you want it to appear in our marketing campaigns."
        ),
      contactPerson: z
        .string()
        .min(1, "Contact person is required")
        .describe(
          "The full name of the primary contact person for your business."
        ),
      email: z.email("Invalid email address"),
      phoneNumber: z.string().min(1, "Phone number is required"),
      companyName: z
        .string()
        .min(1, "Company name is required")
        .describe("The registered name of your company or business entity."),
      instagramHandle: z
        .string()
        .optional()
        .describe("Your business's Instagram profile handle."),
    }),

    productsOffered: z
      .object({
        dishes: z
          .array(
            z.object({
              name: z
                .string()
                .min(1, "Dish name is required")
                .describe("The name of the dish."),
              price: z.coerce
                .number()
                .positive("Price must be positive")
                .describe("Price in EUR"),
            })
          )
          .min(1, "At least one dish is required")
          .max(4, "Maximum of 4 dishes allowed"),
      })
      .describe("Your festival menu. List the dishes you plan to offer."),

    specialRequirements: z.object({
      requirements: z
        .string()
        .optional()
        .describe("Any special requirements for your setup."),

      kitchenEquipment: z
        .string()
        .optional()
        .describe("List any kitchen equipment you will need us to provide"),

      powerSupply: z
        .array(
          z.object({
            device: z.string().min(1, "Device name is required"),
            wattage: z.coerce.number().positive("Wattage must be positive"),
          })
        )
        .optional()
        .describe(
          "List any power-consuming devices and their wattage requirements"
        ),
      storage: z
        .string()
        .optional()
        .describe("Any special storage needs (e.g., refrigeration)."),
    }),

    truck: z.object({
      ownTruck: z
        .boolean()
        .describe(
          "Tick the box if you want to participate in the festival with your own food truck."
        ),
      truckPhotoUrl: z
        .string()
        .optional()
        .describe("A photo of your food truck."),
      truckDimensions: z
        .object({
          length: z.coerce
            .number()
            .positive("Length must be positive")
            .optional(),
          width: z.coerce
            .number()
            .positive("Width must be positive")
            .optional(),
          height: z.coerce
            .number()
            .positive("Height must be positive")
            .optional(),
        })
        .optional(),
      electroMechanicalLicenseUrl: z
        .string()
        .optional()
        .describe("Upload your truck's electro-mechanical license."),
    }),

    files: z.object({
      employees: z
        .array(
          z.object({
            name: z.string().min(1, "Employee name is required"),
            healthCertificate: z
              .string()
              .min(1, "Health certificate is required"),
            socialInsurance: z.string().min(1, "Social insurance is required"),
          })
        )
        .min(1, "At least one employee is required"),
      businessLicense: z.string().min(1, "Business license is required"),
      hygieneInspectionCertification: z
        .string()
        .min(1, "Hygiene inspection certification is required"),
      liabilityInsurance: z.string().min(1, "Liability insurance is required"),
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for truck fields
    if (data.truck.ownTruck) {
      // Truck photo is required
      if (!data.truck.truckPhotoUrl || data.truck.truckPhotoUrl.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Truck photo is required when you own a truck",
          path: ["truck", "truckPhotoUrl"],
        });
      }

      // Truck dimensions are required
      if (
        !data.truck.truckDimensions?.length ||
        data.truck.truckDimensions.length <= 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Truck length is required when you own a truck",
          path: ["truck", "truckDimensions", "length"],
        });
      }

      if (
        !data.truck.truckDimensions?.width ||
        data.truck.truckDimensions.width <= 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Truck width is required when you own a truck",
          path: ["truck", "truckDimensions", "width"],
        });
      }

      if (
        !data.truck.truckDimensions?.height ||
        data.truck.truckDimensions.height <= 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Truck height is required when you own a truck",
          path: ["truck", "truckDimensions", "height"],
        });
      }

      // Electro-mechanical license is required
      if (
        !data.truck.electroMechanicalLicenseUrl ||
        data.truck.electroMechanicalLicenseUrl.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Electro-mechanical license is required when you own a truck",
          path: ["truck", "electroMechanicalLicenseUrl"],
        });
      }
    }
  });

export type VendorFormData = z.infer<typeof vendorFormSchema>;
