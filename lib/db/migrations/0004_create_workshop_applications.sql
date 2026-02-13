CREATE TABLE "workshop_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"contact_person" text NOT NULL,
	"email" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"instagram_handle" text,
	"workshop_title" text NOT NULL,
	"workshop_description" text NOT NULL,
	"session_duration" text NOT NULL,
	"participants_per_session" text NOT NULL,
	"sessions_per_day" text NOT NULL,
	"materials_and_tools" text NOT NULL,
	"target_audience" text NOT NULL,
	"preferred_participation" text NOT NULL,
	"event_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workshop_applications" ADD CONSTRAINT "workshop_applications_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workshop_applications_status_idx" ON "workshop_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workshop_applications_created_at_idx" ON "workshop_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "workshop_applications_email_idx" ON "workshop_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "workshop_applications_event_id_idx" ON "workshop_applications" USING btree ("event_id");