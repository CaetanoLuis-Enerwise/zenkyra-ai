import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCardSkeleton,
  StatsRowSkeleton,
} from "@/components/app/skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-8">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-3 h-7 w-72" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      </Card>
      <StatsRowSkeleton />
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCardSkeleton />
        </div>
        <ChartCardSkeleton />
      </section>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-72 max-w-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-4 w-44" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
