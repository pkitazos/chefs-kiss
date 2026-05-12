export const PERMISSIONS = [
  "admin.access",
  "check_in.access",
  "check_in.toggle",
] as const;

export type PermissionId = (typeof PERMISSIONS)[number];

export const ROLES = ["admin", "check_in_staff"] as const;

export type RoleId = (typeof ROLES)[number];

// RBAC 2 should populate `permissions` on the session user
type UserWithPermissions = {
  permissions?: PermissionId[];
};

export function userHasPermission(
  user: UserWithPermissions,
  permission: PermissionId,
): boolean {
  return user.permissions?.includes(permission) ?? false;
}
