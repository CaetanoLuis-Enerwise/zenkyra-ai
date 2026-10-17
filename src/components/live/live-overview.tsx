"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Clock, Cpu, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { DASH, fmtDate, fmtInt, useLiveData } from "./use-live-data";

function Kpi({ label, value, hint, icon, testId }: { label: string; value: string; hint: string; icon: React.ReactNode; testId: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight" data-testid={testId}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

export function LiveOverview() {
  const { api, tenant, user } = useAuth();
  const summary = useLiveData(() => api.analyticsSummary());
  const docs = useLiveData(() => api.listDocuments());
  const billing = useLiveData(() => api.billingCurrent());

  const s = summary.data;
  const failed = summary.error ? "Could not load from the API" : null;
  const empty = s && s.tasks_completed === 0 && s.llm_calls_trailing_30d === 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
        <Badge variant="default" className="rounded-md px-2 py-0.5">
          Live workspace
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl" data-testid="live-overview-title">
          {tenant?.name ?? DASH}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {user?.email}. Plan: {billing.data?.plan_slug ?? DASH}
          {billing.data?.pilot_ends_at ? ` · pilot ends ${fmtDate(billing.data.pilot_ends_at)}` : ""}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi testId="kpi-tasks" label="Tasks completed · 30d" icon={<Briefcase className="h-4 w-4" />}
          value={summary.loading ? DASH : fmtInt(s?.tasks_completed)}
          hint={failed ?? "Sum of agent runs in your tenant"} />
        <Kpi testId="kpi-hours" label="Hours saved · 30d (estimate)" icon={<Clock className="h-4 w-4" />}
          value={summary.loading || !s ? DASH : s.hours_saved_estimate.toLocaleString("en-GB", { maximumFractionDigits: 1 })}
          hint={failed ?? "Per-run estimates recorded by agents, not measured"} />
        <Kpi testId="kpi-llm" label="AI calls · 30d" icon={<Cpu className="h-4 w-4" />}
          value={summary.loading ? DASH : fmtInt(s?.llm_calls_trailing_30d)}
          hint={failed ?? "Logged model calls for your tenant"} />
        <Kpi testId="kpi-docs" label="Documents" icon={<FileText className="h-4 w-4" />}
          value={docs.loading ? DASH : fmtInt(docs.data?.length)}
          hint={docs.error ? "Could not load from the API" : `${fmtInt(docs.data?.filter((d) => d.status === "ready").length)} indexed`} />
      </section>

      {empty && (
        <Card className="p-5">
          <h3 className="text-base font-semibold">No activity yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Figures here come only from your workspace. Upload a document and ask a question to get started.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/knowledge">
              Open Knowledge Hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
