CREATE TYPE "public"."payment_method" AS ENUM('online', 'in-person');--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "payment_method" "payment_method" DEFAULT 'online' NOT NULL;