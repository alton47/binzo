export function canManageProducts(role?: string) {
  return role === "admin" || role === "manager";
}

export function isAdmin(role?: string) {
  return role === "admin";
}
