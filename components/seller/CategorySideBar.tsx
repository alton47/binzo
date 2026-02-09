"use client";

const categories = ["All", "Drinks", "Snacks", "Food", "Other"];

export default function CategorySidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div className="space-y-1">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`w-full rounded-xl px-4 py-2 text-left text-sm transition
            ${active === c ? "bg-brand text-white" : "hover:bg-zinc-100"}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
