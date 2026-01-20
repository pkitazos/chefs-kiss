import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    locationCode: text("location_code").notNull(),
    location: text("location").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isActive: boolean("is_active").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("events_is_active_idx").on(table.isActive),
    index("events_start_date_idx").on(table.startDate),
  ]
);
