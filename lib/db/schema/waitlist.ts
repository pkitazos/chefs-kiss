import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { bookingTypeEnum } from "./bookings";
import { events } from "./events";

export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "waiting",
  "promoted",
  "cancelled",
]);

export const waitlistEntries = pgTable(
  "waitlist_entries",
  {
    id: text("id").primaryKey(),
    type: bookingTypeEnum("type").notNull(),
    status: waitlistStatusEnum("status").notNull().default("waiting"),
    slotId: text("slot_id").notNull(),

    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    partySize: integer("party_size").notNull(),

    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("waitlist_entries_slot_id_idx").on(table.slotId),
    index("waitlist_entries_status_idx").on(table.status),
    index("waitlist_entries_email_idx").on(table.email),
    index("waitlist_entries_event_id_idx").on(table.eventId),
    index("waitlist_entries_type_idx").on(table.type),
    index("waitlist_entries_created_at_idx").on(table.createdAt),
    uniqueIndex("waitlist_entries_email_slot_active_unique")
      .on(table.email, table.slotId)
      .where(sql`${table.status} = 'waiting'`),
  ],
);
