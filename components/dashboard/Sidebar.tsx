import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-[var(--border-light)] p-6 bg-white">
      <h2 className="text-lg font-semibold mb-8">Inventory</h2>

      <nav className="flex flex-col gap-4 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/inventory">Inventory</Link>
        <Link href="/dashboard/pos">POS</Link>
        <Link href="/dashboard/users">Users</Link>
        <Link href="/dashboard/reports">Reports</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
    </aside>
  );
}
