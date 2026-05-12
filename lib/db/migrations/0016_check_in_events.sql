CREATE TYPE "public"."check_in_action" AS ENUM('checked_in', 'checked_out');--> statement-breakpoint
CREATE TABLE "check_in_events" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"action" "check_in_action" NOT NULL,
	"performed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "check_in_events" ADD CONSTRAINT "check_in_events_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_events" ADD CONSTRAINT "check_in_events_performed_by_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "check_in_events_booking_id_created_at_idx" ON "check_in_events" USING btree ("booking_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "check_in_events_created_at_idx" ON "check_in_events" USING btree ("created_at");
