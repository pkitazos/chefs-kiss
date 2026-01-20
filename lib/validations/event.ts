import { z } from "zod";

export const eventSchema = z.object({
  date: z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
  location: z.string(),
  locationCode: z.string(),
});

export type Event = z.infer<typeof eventSchema>;
