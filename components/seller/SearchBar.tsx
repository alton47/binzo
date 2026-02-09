"use client";
import { Search } from "lucide-react";

export function SearchBar({ onChange }: any) {
  return (
    <div className="sticky top-0 z-10 bg-bg pb-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 opacity-50" />
        <input
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border dark:bg-zinc-800"
        />
      </div>
    </div>
  );
}
