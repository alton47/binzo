export function canManageProducts(role: string | undefined | null) {
  if (!role) return false;
  return role === "admin" || role === "manager";
}

export function isAdmin(role: string | undefined | null) {
  return role === "admin";
}
