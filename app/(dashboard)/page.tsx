import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Total Sales" value="$12,500" />
        <StatCard title="Products" value="120" />
        <StatCard title="Users" value="8" />
      </div>
    </div>
  );
}
