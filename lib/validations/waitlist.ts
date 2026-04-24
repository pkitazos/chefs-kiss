import { z } from "zod";

const baseWaitlistFields = {
  fullName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  partySize: z.coerce.number<number>().int().min(1),
  slotId: z.string().min(1),
};

export const createWaitlistEntrySchema = z.discriminatedUnion("type", [
  z.object({
    ...baseWaitlistFields,
    type: z.literal("workshop"),
  }),
  z.object({
    ...baseWaitlistFields,
    type: z.literal("private-dining"),
  }),
]);

export type CreateWaitlistEntryInput = z.infer<
  typeof createWaitlistEntrySchema
>;
