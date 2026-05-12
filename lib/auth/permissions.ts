import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rolePermission, userRole } from "@/lib/db/schema/rbac";

export const PERMISSIONS = [
  "admin.access",
  "check_in.access",
  "check_in.toggle",
] as const;

export type PermissionId = (typeof PERMISSIONS)[number];

export const ROLES = ["admin", "check_in_staff"] as const;

export type RoleId = (typeof ROLES)[number];

type UserWithPermissions = {
  permissions?: PermissionId[];
};

export function userHasPermission(
  user: UserWithPermissions,
  permission: PermissionId,
): boolean {
  return user.permissions?.includes(permission) ?? false;
}

export async function getUserPermissions(
  userId: string,
): Promise<PermissionId[]> {
  const rows = await db
    .selectDistinct({ permissionId: rolePermission.permissionId })
    .from(userRole)
    .innerJoin(rolePermission, eq(userRole.roleId, rolePermission.roleId))
    .where(eq(userRole.userId, userId));

  return rows.map((r) => r.permissionId) as PermissionId[];
}
