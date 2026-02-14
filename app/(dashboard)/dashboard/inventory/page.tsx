import { getProducts } from "@/lib/db/products";
import AddProductForm from "@/components/inventory/AddProductForm";

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-neutral-500">
            Total items: {products?.length || 0}
          </p>
        </div>
        {/* We can use a Dialog/Modal here later */}
        <button className="btn-black w-auto! px-6 cursor-pointer">
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-(--border-light) overflow-hidden card-shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-50 text-xs uppercase font-bold text-neutral-400 border-b border-(--border-light)">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-light)">
            {products?.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock < 10 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                  >
                    {p.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 font-mono">
                  TSH {p.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-neutral-400 hover:text-black cursor-pointer px-2">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
