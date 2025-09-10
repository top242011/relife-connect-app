import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>

      <div>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>

      <div>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
