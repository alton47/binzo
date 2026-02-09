import Sidebar from "@/components/dashboard/SideBar";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </main>
    </div>
  );
}
