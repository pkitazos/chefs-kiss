-- 1. Create the events table
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location_code" text NOT NULL,
	"location" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 2. Create indexes on events
CREATE INDEX "events_is_active_idx" ON "events" USING btree ("is_active");
--> statement-breakpoint
CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");
--> statement-breakpoint

-- 3. Insert the initial event (Chef's Kiss Ayia Napa 2026)
INSERT INTO "events" ("name", "location_code", "location", "start_date", "end_date", "is_active")
VALUES (
  'Chef''s Kiss Ayia Napa 2026',
  'ANM',
  'Ayia Napa Marina',
  '2026-04-15T00:00:00Z',
  '2026-04-17T00:00:00Z',
  true
);
--> statement-breakpoint

-- 4. Add event_id column as nullable first
ALTER TABLE "vendor_applications" ADD COLUMN "event_id" uuid;
--> statement-breakpoint

-- 5. Update existing applications to reference the newly created event
UPDATE "vendor_applications"
SET "event_id" = (SELECT "id" FROM "events" WHERE "is_active" = true LIMIT 1)
WHERE "event_id" IS NULL;
--> statement-breakpoint

-- 6. Make event_id NOT NULL after data migration
ALTER TABLE "vendor_applications" ALTER COLUMN "event_id" SET NOT NULL;
--> statement-breakpoint

-- 7. Add foreign key constraint
ALTER TABLE "vendor_applications" ADD CONSTRAINT "vendor_applications_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint

-- 8. Add index for event_id
CREATE INDEX "vendor_applications_event_id_idx" ON "vendor_applications" USING btree ("event_id");
