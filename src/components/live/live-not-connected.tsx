import Link from "next/link";
import { PlugZap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";

/** Live mode: pages whose data is not wired to the API yet show this instead of mock data. */
export function LiveNotConnected({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description="Live workspace" />
      <EmptyState
        icon={<PlugZap className="h-5 w-5" />}
        title={`${title} is not connected to your workspace yet`}
        description="This page only has sample content so far, and sample content is never shown in a live workspace. Your documents and the assistant are live in the Knowledge Hub."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/knowledge">Open Knowledge Hub</Link>
          </Button>
        }
      />
    </div>
  );
}
