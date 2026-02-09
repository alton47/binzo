import Skeleton from "@/components/ui/Skeleton";

export default function ProductSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-3 space-y-2">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
