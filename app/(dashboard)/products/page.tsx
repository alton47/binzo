import Sidebar from "@/components/dashboard/Sidebar";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductsPage() {
  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </main>
    </div>
  );
}
