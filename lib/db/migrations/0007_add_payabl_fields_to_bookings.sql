ALTER TABLE "bookings" ADD COLUMN "payabl_transaction_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "payabl_error_code" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "payabl_error_message" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "paid_at" timestamp;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "payment_reference";