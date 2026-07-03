interface PropertyCardSkeletonProps {
  count?: number;
}

function SingleSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="h-5 w-3/5 animate-pulse rounded-md bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-md bg-slate-100" />
        <div className="h-4 w-2/5 animate-pulse rounded-md bg-slate-100" />
        <div className="mt-2 h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function PropertyCardSkeleton({ count = 1 }: PropertyCardSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {Array.from({ length: count }, (_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </div>
  );
}

export function PropertyCardSkeletonList({ count = 10 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </div>
  );
}
