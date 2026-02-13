ALTER TABLE "vendor_applications" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vendor_applications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "vendor_dishes" ALTER COLUMN "vendor_application_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vendor_employees" ALTER COLUMN "vendor_application_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vendor_power_requirements" ALTER COLUMN "vendor_application_id" SET DATA TYPE text;