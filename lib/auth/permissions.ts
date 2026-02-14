import { UserRole, ROLE_HIERARCHY } from "./roles";

export function hasMinimumRole(
  userRole: UserRole | undefined,
  requiredRole: UserRole,
) {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageProducts(role?: UserRole) {
  return hasMinimumRole(role, "manager");
}

export function canManageUsers(role?: UserRole) {
  return hasMinimumRole(role, "admin");
}
