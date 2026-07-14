import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-48" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-white/40 p-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
