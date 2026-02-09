"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products…"
      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm
                 focus:outline-none focus:border-zinc-400"
    />
  );
}
