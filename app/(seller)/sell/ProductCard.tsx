"use client";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

export function ProductCard({ product }: any) {
  const sell = async () => {
    if (product.stock <= 0) return;

    await supabase.from("sales").insert({
      product_id: product.id,
      quantity: 1,
      sold_by: (await supabase.auth.getUser()).data.user?.id,
    });

    await supabase
      .from("products")
      .update({ stock: product.stock - 1 })
      .eq("id", product.id);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="bg-white dark:bg-zinc-900 rounded-xl p-3 shadow"
    >
      <div className="aspect-square bg-zinc-100 rounded mb-2" />

      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm opacity-70">Stock: {product.stock}</p>
      <p className="font-bold">${product.price}</p>

      <button
        onClick={sell}
        className="mt-2 w-full bg-brand text-white py-1 rounded"
      >
        Sell
      </button>
    </motion.div>
  );
}
