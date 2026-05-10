import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-white/10", className)}
      {...props}
    />
  );
}

const TripCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
    <Skeleton className="mb-4 h-48 w-full rounded-2xl" />
    <Skeleton className="mb-2 h-6 w-3/4" />
    <Skeleton className="mb-4 h-4 w-1/2" />
    <div className="flex justify-between">
      <Skeleton className="h-8 w-20 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 py-4">
    <div className="relative overflow-hidden rounded-3xl bg-slate-200 p-8 dark:bg-white/5 md:p-12">
      <Skeleton className="mb-4 h-12 w-1/2" />
      <Skeleton className="h-6 w-3/4" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <Skeleton className="mb-2 h-4 w-1/2" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      ))}
    </div>
    <div>
      <Skeleton className="mb-4 h-8 w-40" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => <TripCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

const TripDetailsSkeleton = () => (
  <div className="space-y-8 py-4">
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
    <div className="flex gap-4 border-b border-slate-200 pb-2 dark:border-white/10">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
    </div>
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="mx-auto max-w-4xl py-4 space-y-8">
    <div className="flex flex-col items-center gap-6 md:flex-row">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="flex-1 space-y-2 text-center md:text-left">
        <Skeleton className="h-10 w-48 mx-auto md:mx-0" />
        <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
    </div>
    <div className="space-y-4 pt-8 border-t dark:border-white/10">
      <Skeleton className="h-8 w-40" />
      <div className="flex flex-wrap gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-32 rounded-full" />)}
      </div>
    </div>
  </div>
);

export { Skeleton, TripCardSkeleton, DashboardSkeleton, TripDetailsSkeleton, ProfileSkeleton };
