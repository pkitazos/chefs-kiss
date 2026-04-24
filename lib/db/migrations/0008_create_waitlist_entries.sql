CREATE TYPE "public"."waitlist_status" AS ENUM('waiting', 'promoted', 'cancelled');--> statement-breakpoint
CREATE TABLE "waitlist_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "booking_type" NOT NULL,
	"status" "waitlist_status" DEFAULT 'waiting' NOT NULL,
	"slot_id" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"party_size" integer NOT NULL,
	"event_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "waitlist_entries_slot_id_idx" ON "waitlist_entries" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "waitlist_entries_status_idx" ON "waitlist_entries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "waitlist_entries_email_idx" ON "waitlist_entries" USING btree ("email");--> statement-breakpoint
CREATE INDEX "waitlist_entries_event_id_idx" ON "waitlist_entries" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "waitlist_entries_type_idx" ON "waitlist_entries" USING btree ("type");--> statement-breakpoint
CREATE INDEX "waitlist_entries_created_at_idx" ON "waitlist_entries" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entries_email_slot_active_unique" ON "waitlist_entries" USING btree ("email","slot_id") WHERE "waitlist_entries"."status" = 'waiting';