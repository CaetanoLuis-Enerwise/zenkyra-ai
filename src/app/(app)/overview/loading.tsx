import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCardSkeleton,
  StatsRowSkeleton,
} from "@/components/app/skeletons";

export default function OverviewLoading() {
  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-8">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-3 h-7 w-72" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      </Card>
      <StatsRowSkeleton />
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-64" />
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </Card>
        <ChartCardSkeleton />
      </section>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCardSkeleton />
        </div>
        <ChartCardSkeleton />
      </section>
    </div>
  );
}
