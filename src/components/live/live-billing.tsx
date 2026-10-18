"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { DASH, fmtDate, useLiveData } from "./use-live-data";

export function LiveBilling() {
  const { api, tenant } = useAuth();
  const current = useLiveData(() => api.billingCurrent());
  const plans = useLiveData(() => api.billingPlans());
  const plan = plans.data?.find((p) => p.slug === current.data?.plan_slug);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plan"
        title="Billing"
        description="Your current plan. Invoices are issued manually for now; there is no card checkout in the app."
        meta={<span>Workspace: {tenant?.name ?? DASH}</span>}
      />
      <Card className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current plan</p>
        {current.error ? (
          <p className="mt-2 text-sm text-destructive">Could not load your plan from the API.</p>
        ) : (
          <>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight" data-testid="live-plan">
              {plan?.name ?? current.data?.plan_slug ?? DASH}
              {plan && <Badge variant="default">{plan.price_display}</Badge>}
            </h2>
            {current.data?.pilot_ends_at && (
              <p className="mt-1 text-sm text-muted-foreground" data-testid="live-pilot-ends">
                Pilot ends {fmtDate(current.data.pilot_ends_at)}
              </p>
            )}
            {plan && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {plan.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
