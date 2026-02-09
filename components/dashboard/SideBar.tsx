"use client";

import Link from "next/link";
import { hasPermission } from "@/lib/permissions";
import { Role } from "@/lib/types";

export default function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="w-60 bg-white border-r p-4 hidden md:block">
      <nav className="space-y-2 text-sm">
        {hasPermission(role, "view_dashboard") && (
          <Link href="/dashboard" className="block hover:text-brand">
            Dashboard
          </Link>
        )}

        {hasPermission(role, "manage_products") && (
          <Link href="/products" className="block hover:text-brand">
            Products
          </Link>
        )}

        {hasPermission(role, "view_users") && (
          <Link href="/users" className="block hover:text-brand">
            Users
          </Link>
        )}

        {hasPermission(role, "manage_settings") && (
          <Link href="/settings" className="block hover:text-brand">
            Settings
          </Link>
        )}
      </nav>
    </aside>
  );
}
