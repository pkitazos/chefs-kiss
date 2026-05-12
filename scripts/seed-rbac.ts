import "dotenv/config";
import type { PermissionId, RoleId } from "../lib/auth/permissions";
import { db } from "../lib/db";
import { permission, role, rolePermission } from "../lib/db/schema/rbac";

const ROLES_DATA: { id: RoleId; name: string; description: string }[] = [
  { id: "admin", name: "Admin", description: "Full administrative access" },
  {
    id: "check_in_staff",
    name: "Check-in Staff",
    description: "Can view and toggle guest check-in status",
  },
];

const PERMISSIONS_DATA: {
  id: PermissionId;
  name: string;
  description: string;
}[] = [
  {
    id: "admin.access",
    name: "Admin Access",
    description: "Access the admin panel",
  },
  {
    id: "check_in.access",
    name: "Check-in Access",
    description: "View the check-in interface",
  },
  {
    id: "check_in.toggle",
    name: "Check-in Toggle",
    description: "Toggle guest check-in status",
  },
];

const ROLE_PERMISSIONS: Record<RoleId, PermissionId[]> = {
  admin: ["admin.access", "check_in.access", "check_in.toggle"],
  check_in_staff: ["check_in.access", "check_in.toggle"],
};

async function seedRbac() {
  console.log("Seeding RBAC data...\n");

  for (const r of ROLES_DATA) {
    await db
      .insert(role)
      .values(r)
      .onConflictDoUpdate({
        target: role.id,
        set: { name: r.name, description: r.description },
      });
    console.log(`  Role: ${r.id}`);
  }

  for (const p of PERMISSIONS_DATA) {
    await db
      .insert(permission)
      .values(p)
      .onConflictDoUpdate({
        target: permission.id,
        set: { name: p.name, description: p.description },
      });
    console.log(`  Permission: ${p.id}`);
  }

  for (const [roleId, permissionIds] of Object.entries(ROLE_PERMISSIONS)) {
    for (const permissionId of permissionIds) {
      await db
        .insert(rolePermission)
        .values({ roleId, permissionId })
        .onConflictDoNothing();
    }
    console.log(`  ${roleId} → [${permissionIds.join(", ")}]`);
  }

  console.log("\nRBAC seed complete.");
  process.exit(0);
}

seedRbac().catch((err) => {
  console.error("Failed to seed RBAC:", err);
  process.exit(1);
});
