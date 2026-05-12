CREATE TABLE "permission" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permission" (
	"roleId" text NOT NULL,
	"permissionId" text NOT NULL,
	CONSTRAINT "role_permission_roleId_permissionId_pk" PRIMARY KEY("roleId","permissionId")
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"userId" text NOT NULL,
	"roleId" text NOT NULL,
	CONSTRAINT "user_role_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissionId_permission_id_fk" FOREIGN KEY ("permissionId") REFERENCES "public"."permission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;

-- Seed permissions
 INSERT INTO "permission" ("id", "name", "description", "createdAt", "updatedAt")
 VALUES
   ('admin.access', 'Admin Access', 'Access the admin panel', now(), now()),
   ('check_in.access', 'Check-in Access', 'View the check-in interface', now(), now()),
   ('check_in.toggle', 'Check-in Toggle', 'Toggle guest check-in status', now(), now())
 ON CONFLICT ("id") DO NOTHING;

 -- Seed roles
 INSERT INTO "role" ("id", "name", "description", "createdAt", "updatedAt")
 VALUES
   ('admin', 'Admin', 'Full administrative access', now(), now()),
   ('check_in_staff', 'Check-in Staff', 'Can view and toggle guest check-in status', now(), now())
 ON CONFLICT ("id") DO NOTHING;

 -- Seed role-permission mappings
 INSERT INTO "role_permission" ("roleId", "permissionId")
 VALUES
   ('admin', 'admin.access'),
   ('admin', 'check_in.access'),
   ('admin', 'check_in.toggle'),
   ('check_in_staff', 'check_in.access'),
   ('check_in_staff', 'check_in.toggle')
 ON CONFLICT DO NOTHING;

 -- Grant admin role to all existing users
 INSERT INTO "user_role" ("userId", "roleId")
 SELECT "id", 'admin' FROM "user"
 WHERE "createdAt" < '2026-05-13'
 ON CONFLICT DO NOTHING;
