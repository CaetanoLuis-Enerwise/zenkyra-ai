import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/app/skeletons";

export default function KnowledgeLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-3">
              <Skeleton className="h-3 w-20" />
              <div className="mt-3 space-y-1.5">
                {Array.from({ length: 5 }).map((__, j) => (
                  <Skeleton key={j} className="h-7 w-full rounded-md" />
                ))}
              </div>
            </Card>
          ))}
        </aside>
        <div className="space-y-5">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}
