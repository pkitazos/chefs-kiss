ALTER TYPE "public"."waitlist_status" ADD VALUE 'revoked';--> statement-breakpoint
ALTER TYPE "public"."seat_hold_status" ADD VALUE 'consumed';--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "waitlist_entry_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_waitlist_entry_id_waitlist_entries_id_fk" FOREIGN KEY ("waitlist_entry_id") REFERENCES "public"."waitlist_entries"("id") ON DELETE set null ON UPDATE no action;
