import { formatMoney } from "@/lib/utils";

export default function ProductCard({ product }: any) {
  return (
    <div className="bg-white border border-(--border-light) rounded-2xl p-4 space-y-3">
      <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div>
        <h4 className="font-bold">{product.name}</h4>
        <p className="text-sm text-(--text-secondary)">
          {product.stock} units left
        </p>
        <p className="text-lg font-black mt-1">{formatMoney(product.price)}</p>
      </div>
    </div>
  );
}
