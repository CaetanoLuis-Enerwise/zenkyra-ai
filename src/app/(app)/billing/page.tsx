import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BillingPlans } from "@/components/app/billing-plans";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plan & usage"
        title="Billing"
        description="Manage your plan, monitor usage and access invoices."
        meta={
          <>
            <span>Workspace: Acme Inc.</span>
            <span className="hidden md:inline">·</span>
            <span>Billing currency: EUR</span>
            <span className="hidden md:inline">·</span>
            <span>VAT ID: PT 510 123 456</span>
          </>
        }
        actions={
          <Button variant="outline" size="sm">
            Download invoices
          </Button>
        }
      />

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current plan
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
              Growth
              <Badge variant="default">€799 / mo</Badge>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Renews on May 14, 2026 · paid by SEPA Direct Debit
            </p>
          </div>
          <Button>
            <Sparkles className="h-4 w-4" />
            Upgrade to Enterprise
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <UsageMeter label="Users" value={142} max={200} unit="seats" />
          <UsageMeter label="Queries" value={42917} max={100000} unit="this month" />
          <UsageMeter label="Storage" value={38} max={200} unit="GB used" />
        </div>
      </Card>

      <BillingPlans />
    </div>
  );
}

function UsageMeter({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const pct = Math.round((value / max) * 100);
  const color = pct > 85 ? "text-warning" : pct > 95 ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold">
        {value.toLocaleString()}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          / {max.toLocaleString()}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">{unit}</p>
      <Progress value={pct} className="mt-3" />
      <p className={`mt-1.5 text-[11px] ${color}`}>{pct}% used</p>
    </div>
  );
}
