import { z } from "zod";

// Workshop title and brief description
// Workshop content and activity outline
// Duration of each session
// Number of participants per session
// Number of sessions per day
// Materials and tools required
// Target audience (e.g. adults, families, children)
// Preferred participation (one day or two days)
// Contact details for participant communication

export const workshopCreationFormSchema = z.object({
  generalInfo: z.object({
    title: z
      .string()
      .min(1, "Workshop title is required")
      .describe("Title of the workshop"),
    description: z
      .string()
      .min(1, "Workshop description is required")
      .describe("Brief description of the workshop"),
  }),

  // ? ti en touto?
  contentOutline: z
    .string()
    .min(1, "Content outline is required")
    .describe("Outline of the workshop content and activities"),

  sessionDetails: z.object({
    duration: z.coerce
      .number<number>()
      .positive("Duration must be a positive number")
      .describe("Duration of each session in minutes"),
    participantsPerSession: z.coerce
      .number<number>()
      .positive("Participants per session must be a positive number")
      .describe("Number of participants per session"),
    sessionsPerDay: z.coerce
      .number<number>()
      .positive("Sessions per day must be a positive number")
      .describe("Number of sessions per day"),
  }),
  materialsAndTools: z
    .string()
    .min(1, "Materials and tools information is required")
    .describe("Materials and tools required for the workshop"),

  targetAudience: z
    .enum(["adults", "families", "children"], {
      error:
        "Target audience must be either 'adults', 'families', or 'children'",
    })
    .describe("Target audience for the workshop"),

  preferredParticipation: z
    .enum(["one day", "two days"], {
      error: "Preferred participation must be either 'one day' or 'two days'",
    })
    .describe("Preferred participation duration"),

  contactDetails: z.object({
    email: z
      .email("Invalid email address")
      .describe("Email address for participant communication"),

    phone: z
      .string()
      .optional()
      .describe("Phone number for participant communication"),
  }),
});

export type WorkshopCreationFormData = z.infer<
  typeof workshopCreationFormSchema
>;
