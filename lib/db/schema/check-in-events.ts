import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";
import { user } from "./users";

export const checkInActionEnum = pgEnum("check_in_action", [
  "checked_in",
  "checked_out",
]);

export const checkInEvents = pgTable(
  "check_in_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    action: checkInActionEnum("action").notNull(),
    performedBy: text("performed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("check_in_events_booking_id_created_at_idx").on(
      table.bookingId,
      table.createdAt.desc(),
    ),
    index("check_in_events_created_at_idx").on(table.createdAt),
  ],
);

export type CheckInEvent = typeof checkInEvents.$inferSelect;
