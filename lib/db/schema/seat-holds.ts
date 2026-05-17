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
import { events } from "./events";
import { user } from "./users";

export const seatHoldStatusEnum = pgEnum("seat_hold_status", [
  "active",
  "released",
  "consumed",
]);

export const seatHolds = pgTable(
  "seat_holds",
  {
    id: text("id").primaryKey(),
    slotId: text("slot_id").notNull(),
    seatCount: integer("seat_count").notNull(),
    status: seatHoldStatusEnum("status").notNull().default("active"),
    note: text("note"),

    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    releasedAt: timestamp("released_at"),
    checkedInAt: timestamp("checked_in_at"),
  },
  (table) => [
    index("seat_holds_slot_id_idx").on(table.slotId),
    index("seat_holds_status_idx").on(table.status),
    index("seat_holds_event_id_idx").on(table.eventId),
    index("seat_holds_created_at_idx").on(table.createdAt),
    check(
      "seat_holds_slot_id_format",
      sql`${table.slotId} LIKE 'WS-%' OR ${table.slotId} LIKE 'PD-%'`,
    ),
    check("seat_holds_seat_count_positive", sql`${table.seatCount} > 0`),
  ],
);
