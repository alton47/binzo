import Sidebar from "@/components/dashboard/Sidebar";
import Skeleton from "@/components/ui/Skeleton";

export default function UsersPage() {
  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Users</h1>

        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </main>
    </div>
  );
}
