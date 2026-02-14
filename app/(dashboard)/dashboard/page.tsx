import { getMyProfile } from "@/lib/auth/get-profile";
import { getProducts } from "@/lib/db/products";

export default async function DashboardPage() {
  const profile = await getMyProfile();
  const products = await getProducts();

  // Basic stats logic
  const totalStock = products?.reduce((acc, p) => acc + p.stock, 0) || 0;
  const lowStockItems = products?.filter((p) => p.stock < 5).length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.name}</h1>
        <p className="text-(--text-secondary)">
          Here is what's happening at {profile?.organizations?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-(--border-light) card-shadow">
          <p className="text-sm font-medium text-(--text-secondary)">
            Total Products
          </p>
          <p className="text-4xl font-bold mt-2">{products?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-(--border-light) card-shadow">
          <p className="text-sm font-medium text-(--text-secondary)">
            Items in Stock
          </p>
          <p className="text-4xl font-bold mt-2">{totalStock}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-(--border-light) card-shadow">
          <p className="text-sm font-medium text-red-500">Low Stock Alerts</p>
          <p className="text-4xl font-bold mt-2">{lowStockItems}</p>
        </div>
      </div>
    </div>
  );
}
