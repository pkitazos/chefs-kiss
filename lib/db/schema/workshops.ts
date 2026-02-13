import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { applicationStatusEnum } from "./applications";

export const workshopApplications = pgTable(
  "workshop_applications",
  {
    id: text("id").primaryKey(),
    status: applicationStatusEnum("status").notNull().default("pending"),

    contactPerson: text("contact_person").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phoneNumber").notNull(),
    instagramHandle: text("instagram_handle"),

    workshopTitle: text("workshop_title").notNull(),
    workshopDescription: text("workshop_description").notNull(),

    sessionDuration: integer("session_duration").notNull(),
    participantsPerSession: integer("participants_per_session").notNull(),
    sessionsPerDay: integer("sessions_per_day").notNull(),

    materialsAndTools: text("materials_and_tools").notNull(),
    targetAudience: text("target_audience").notNull(),
    preferredParticipation: text("preferred_participation").notNull(),

    // Event reference
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("workshop_applications_status_idx").on(table.status),
    index("workshop_applications_created_at_idx").on(table.createdAt),
    index("workshop_applications_email_idx").on(table.email),
    index("workshop_applications_event_id_idx").on(table.eventId),
  ],
);
