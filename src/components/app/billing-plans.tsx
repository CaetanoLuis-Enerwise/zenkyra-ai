import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans: {
  name: string;
  monthly: number | "custom";
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}[] = [
  {
    name: "Starter",
    monthly: 299,
    description: "For small teams getting started with private AI.",
    features: [
      "Sales, Support and Ops agent runners",
      "Upload PDFs · chat grounded on them",
      "Email support",
    ],
  },
  {
    name: "Growth",
    monthly: 799,
    description: "The same product as Starter, on a larger agreement.",
    features: [
      "Same product as Starter",
      "Task and LLM-call counts — not a claimed ROI",
      "Priority support",
    ],
    highlight: true,
    badge: "Sample",
  },
  {
    name: "Enterprise",
    monthly: "custom",
    description: "A written scope. Private VPC is not included.",
    features: [
      "Scope agreed in writing",
      "VPC and bring-your-own LLM are roadmap, not included",
      "No SOC 2 yet. Data stays in your tenant.",
      "Dedicated CSM",
    ],
  },
];

export function BillingPlans() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative flex flex-col p-6",
              p.highlight && "border-brand/40 ring-1 ring-brand/30"
            )}
          >
            {p.highlight && (
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-brand/5 to-transparent" />
            )}
            <div className="relative flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {p.badge && <Badge variant="default">{p.badge}</Badge>}
            </div>
            <Price plan={p} />
            <p className="relative mt-1 text-sm text-muted-foreground">{p.description}</p>
            <ul className="relative mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Prices in EUR · VAT not included · invoiced manually · no card checkout
      </p>
    </div>
  );
}

function Price({ plan }: { plan: (typeof plans)[number] }) {
  if (plan.monthly === "custom") {
    return (
      <div className="relative mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">Custom</span>
      </div>
    );
  }

  return (
    <div className="relative mt-3">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">€{plan.monthly}</span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">billed monthly</p>
    </div>
  );
}
