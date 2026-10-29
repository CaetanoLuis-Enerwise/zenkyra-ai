import { LiveBilling } from "@/components/live/live-billing";
import { LIVE_MODE } from "@/lib/config";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingPlans } from "@/components/app/billing-plans";

function MockBillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plan"
        title="Billing"
        description="Demo layout only. A live workspace shows the plan from the API. Invoices are issued manually; there is no card checkout."
        meta={
          <>
            <span>Demo data</span>
            <span className="hidden md:inline">·</span>
            <span>Prices excl. VAT</span>
          </>
        }
      />

      <Card className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sample plan label
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
          Growth
          <Badge variant="default">€799 / mo</Badge>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Not a customer account. No usage is metered on this page.
        </p>
      </Card>

      <BillingPlans />
    </div>
  );
}

// NEXT_PUBLIC_API_URL set → live tenant data (or an honest "not connected" state); unset → demo data.
export default function BillingPage() {
  return LIVE_MODE ? <LiveBilling /> : <MockBillingPage />;
}
