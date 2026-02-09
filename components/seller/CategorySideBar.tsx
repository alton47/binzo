export function CategorySidebar({ categories, onSelect }: any) {
  return (
    <div className="hidden md:block w-40 space-y-2">
      {categories.map((c: string) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
