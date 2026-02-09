"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import { CategorySidebar } from "@/components/seller/CategorySideBar";
import ProductSkeleton from "@/components/seller/ProductSkeleton";
import { SearchBar } from "@/components/seller/SearchBar";
import { ProductCard } from "@/components/seller/ProductCard";

export default function SellPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").gt("stock", 0);

    setProducts(data || []);
    setLoading(false);
  };

  const sell = async (p: Product) => {
    if (p.stock <= 0) return;

    await supabase
      .from("products")
      .update({ stock: p.stock - 1 })
      .eq("id", p.id);

    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, stock: x.stock - 1 } : x)),
    );
  };

  const filtered = products.filter((p) => {
    const s = p.name.toLowerCase().includes(search.toLowerCase());
    const c = category === "All" || p.category === category;
    return s && c;
  });

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="hidden sm:block w-56 bg-white border-r p-4">
        <CategorySidebar active={category} onSelect={setCategory} />
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : filtered.map((p) => (
                <ProductCard key={p.id} product={p} onSell={sell} />
              ))}
        </div>
      </main>
    </div>
  );
}
