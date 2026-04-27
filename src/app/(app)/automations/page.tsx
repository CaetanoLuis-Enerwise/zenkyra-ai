import { Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { AutomationCard } from "@/components/app/automation-card";
import { api } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export default async function AutomationsPage() {
  const items = await api.automations();

  const active = items.filter((a) => a.status === "active").length;
  const totalRuns = items.reduce((acc, a) => acc + a.runs, 0);
  const totalHours = items.reduce((acc, a) => acc + a.hoursSaved, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        description="Pre-built and custom AI agents that act on your business — without bothering your team."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4" />
              Browse templates
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Create automation
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Pill label="Total automations" value={String(items.length)} />
        <Pill label="Active" value={String(active)} highlight />
        <Pill label="Runs this month" value={formatNumber(totalRuns)} />
        <Pill label="Hours saved" value={`${totalHours} hrs`} />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((a, i) => (
          <AutomationCard key={a.id} a={a} index={i} />
        ))}
      </div>
    </div>
  );
}

function Pill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-lg border border-brand/30 bg-brand/5 px-4 py-3"
          : "rounded-lg border border-border bg-card px-4 py-3"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
