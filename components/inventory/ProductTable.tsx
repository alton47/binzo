import Card from "@/components/ui/Card";

export default function ProductTable() {
  return (
    <Card>
      <p className="text-sm text-[var(--text-secondary)] mb-4">Products</p>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-[var(--border-light)]">
            <th className="py-2">Name</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--border-light)]">
            <td className="py-2">Sample Product</td>
            <td>25</td>
            <td>$40</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
