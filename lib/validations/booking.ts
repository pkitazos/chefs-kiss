import { z } from "zod";

export function createBookingFormSchema(maxSeats: number, minSeats = 1) {
  return z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    seats: z.coerce.number<number>().int().min(minSeats).max(maxSeats),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms & Conditions and Privacy Policy",
    }),
  });
}

const baseBookingFields = {
  fullName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  seats: z.coerce.number<number>().int().min(1),
  slotId: z.string().min(1),
  browserSessionId: z.string().optional(),
};

export const createBookingSchema = z.discriminatedUnion("type", [
  z.object({
    ...baseBookingFields,
    type: z.literal("workshop"),
    workshopSlug: z.string().min(1),
  }),
  z.object({
    ...baseBookingFields,
    type: z.literal("private-dining"),
  }),
]);

export type BookingFormData = z.infer<
  ReturnType<typeof createBookingFormSchema>
>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
