import { pgEnum } from "drizzle-orm/pg-core";

// Enum for application status
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);
