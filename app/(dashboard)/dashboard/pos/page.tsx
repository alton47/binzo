"use client";

import { useEffect, useState } from "react";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleSale = async (productId: string) => {
    const res = await fetch("/api/sales", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });
    if (res.ok) {
      alert("Sale recorded!");
      window.location.reload(); // Quick refresh to update stock
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Point of Sale</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: any) => (
          <button
            key={product.id}
            onClick={() => handleSale(product.id)}
            disabled={product.stock === 0}
            className="group bg-white p-4 rounded-2xl border border-(--border-light) hover:border-black transition-all text-left space-y-3"
          >
            <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
              {product.image_url && (
                <img
                  src={product.image_url}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div>
              <p className="font-semibold truncate">{product.name}</p>
              <p className="text-sm text-(--text-secondary)">
                {product.stock} in stock
              </p>
              <p className="font-bold mt-1">
                TSH {product.price.toLocaleString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
