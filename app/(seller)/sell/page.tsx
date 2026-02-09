"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { SkeletonGrid } from "./SkeletonGrid";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
};

export default function SellPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Sell Products</h1>

      {loading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
