import { pgEnum } from "drizzle-orm/pg-core";

export const bookingTypeEnum = pgEnum("booking_type", [
  "private-dining",
  "workshop",
]);
