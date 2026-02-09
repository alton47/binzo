import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="w-60 bg-white border-r p-4 hidden md:block">
      <nav className="space-y-2 text-sm">
        <Link href="/dashboard" className="block hover:text-brand">
          Dashboard
        </Link>
        <Link href="/products" className="block hover:text-brand">
          Products
        </Link>
        <Link href="/users" className="block hover:text-brand">
          Users
        </Link>
        <Link href="/settings" className="block hover:text-brand">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
