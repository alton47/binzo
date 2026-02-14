export type UserRole = "admin" | "manager" | "seller";

export const ROLES = {
  ADMIN: "admin" as UserRole,
  MANAGER: "manager" as UserRole,
  SELLER: "seller" as UserRole,
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  manager: 2,
  seller: 1,
};
