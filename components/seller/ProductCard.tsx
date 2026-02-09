"use client";

import { Product } from "@/lib/types";
import { motion } from "framer-motion";

export default function ProductCard({
  product,
  onSell,
}: {
  product: Product;
  onSell: (p: Product) => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onSell(product)}
      className="rounded-xl border bg-white p-3 text-left
                 shadow-sm hover:shadow-md transition"
    >
      <div className="aspect-square w-full rounded-lg bg-zinc-100 mb-2 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400">
            No image
          </div>
        )}
      </div>

      <h3 className="font-medium text-sm truncate">{product.name}</h3>

      <div className="mt-1 flex justify-between text-xs text-zinc-500">
        <span>${product.price}</span>
        <span>{product.stock} left</span>
      </div>
    </motion.button>
  );
}
