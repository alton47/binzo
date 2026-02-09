import { Role } from "./types";

export type Permission =
  | "sell_product"
  | "view_products"
  | "manage_products"
  | "view_users"
  | "manage_users"
  | "view_dashboard"
  | "view_analytics"
  | "manage_settings";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  seller: ["sell_product", "view_products"],

  manager: [
    "sell_product",
    "view_products",
    "view_dashboard",
    "view_analytics",
  ],

  admin: [
    "sell_product",
    "view_products",
    "manage_products",
    "view_users",
    "manage_users",
    "view_dashboard",
    "view_analytics",
    "manage_settings",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
