export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-zinc-200 dark:bg-zinc-800 h-48 rounded-xl"
        />
      ))}
    </div>
  );
}
