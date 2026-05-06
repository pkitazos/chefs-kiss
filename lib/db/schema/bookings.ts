import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { bookingTypeEnum } from "./enums";
import { events } from "./events";
import { waitlistEntries } from "./waitlist";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "failed",
  "expired",
  "cancelled",
]);

export type Booking = typeof bookings.$inferSelect;

export const bookings = pgTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    type: bookingTypeEnum("type").notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    slotId: text("slot_id").notNull(),

    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    seats: integer("seats").notNull(),
    totalAmount: integer("total_amount").notNull(),

    browserSessionId: text("browser_session_id"),

    payablTransactionId: text("payabl_transaction_id"),
    payablErrorCode: text("payabl_error_code"),
    payablErrorMessage: text("payabl_error_message"),
    paidAt: timestamp("paid_at"),

    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),

    waitlistEntryId: text("waitlist_entry_id").references(
      () => waitlistEntries.id,
      { onDelete: "set null" },
    ),

    confirmationEmailSentAt: timestamp("confirmation_email_sent_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
  },
  (table) => [
    index("bookings_slot_id_idx").on(table.slotId),
    index("bookings_status_idx").on(table.status),
    index("bookings_email_idx").on(table.email),
    index("bookings_event_id_idx").on(table.eventId),
    index("bookings_type_idx").on(table.type),
    index("bookings_created_at_idx").on(table.createdAt),
    index("bookings_browser_session_id_idx").on(table.browserSessionId),
    check(
      "bookings_slot_id_format",
      sql`${table.slotId} LIKE 'WS-%' OR ${table.slotId} LIKE 'PD-%'`,
    ),
  ],
);
