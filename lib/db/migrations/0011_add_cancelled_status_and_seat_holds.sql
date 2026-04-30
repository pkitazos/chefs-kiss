CREATE TYPE "public"."seat_hold_status" AS ENUM('active', 'released');--> statement-breakpoint
ALTER TYPE "public"."booking_status" ADD VALUE 'cancelled';--> statement-breakpoint
CREATE TABLE "seat_holds" (
	"id" text PRIMARY KEY NOT NULL,
	"slot_id" text NOT NULL,
	"seat_count" integer NOT NULL,
	"status" "seat_hold_status" DEFAULT 'active' NOT NULL,
	"note" text,
	"created_by" text NOT NULL,
	"event_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"released_at" timestamp,
	CONSTRAINT "seat_holds_slot_id_format" CHECK ("seat_holds"."slot_id" LIKE 'WS-%' OR "seat_holds"."slot_id" LIKE 'PD-%'),
	CONSTRAINT "seat_holds_seat_count_positive" CHECK ("seat_holds"."seat_count" > 0)
);
--> statement-breakpoint
ALTER TABLE "seat_holds" ADD CONSTRAINT "seat_holds_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_holds" ADD CONSTRAINT "seat_holds_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "seat_holds_slot_id_idx" ON "seat_holds" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "seat_holds_status_idx" ON "seat_holds" USING btree ("status");--> statement-breakpoint
CREATE INDEX "seat_holds_event_id_idx" ON "seat_holds" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "seat_holds_created_at_idx" ON "seat_holds" USING btree ("created_at");
