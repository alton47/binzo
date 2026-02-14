"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-(--border-light) flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tighter">
          Kariakoo<span className="text-neutral-400">POS</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Inventory", href: "/dashboard/inventory" },
          { name: "POS", href: "/dashboard/pos" },
          { name: "Team", href: "/dashboard/users" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              pathname === item.href
                ? "bg-black text-white"
                : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-(--border-light)">
        <button
          onClick={() =>
            supabase.auth.signOut().then(() => (window.location.href = "/"))
          }
          className="w-full py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
