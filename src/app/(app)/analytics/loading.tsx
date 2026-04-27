import {
  ChartCardSkeleton,
  PageHeaderSkeleton,
  StatsRowSkeleton,
} from "@/components/app/skeletons";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatsRowSkeleton />
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCardSkeleton tall />
        </div>
        <ChartCardSkeleton tall />
      </section>
      <ChartCardSkeleton />
    </div>
  );
}
