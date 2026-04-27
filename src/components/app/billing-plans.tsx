"use client";

import * as React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "annual";

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
      "Up to 25 users",
      "5,000 queries / month",
      "20 GB knowledge storage",
      "5 automation templates",
      "Email support",
    ],
  },
  {
    name: "Growth",
    monthly: 799,
    description: "For scaling companies that need full automation.",
    features: [
      "Up to 200 users",
      "Unlimited queries",
      "200 GB knowledge storage",
      "Unlimited automations",
      "Custom workflows",
      "Priority support",
    ],
    highlight: true,
    badge: "Current plan",
  },
  {
    name: "Enterprise",
    monthly: "custom",
    description: "For regulated industries and larger deployments.",
    features: [
      "Unlimited users",
      "Private deployment",
      "EU data residency",
      "SSO + SCIM",
      "SOC 2 / ISO 27001 evidence",
      "Dedicated CSM",
    ],
  },
];

export function BillingPlans() {
  const [cycle, setCycle] = React.useState<Cycle>("annual");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2">
        <CycleToggle cycle={cycle} setCycle={setCycle} />
      </div>

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
            <Price plan={p} cycle={cycle} />
            <p className="relative mt-1 text-sm text-muted-foreground">{p.description}</p>
            <ul className="relative mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="relative mt-6">
              <Button
                variant={p.highlight ? "default" : "outline"}
                className="w-full"
              >
                {p.name === "Enterprise" ? "Talk to sales" : `Choose ${p.name}`}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Prices in EUR · VAT not included · cancel anytime
      </p>
    </div>
  );
}

function CycleToggle({
  cycle,
  setCycle,
}: {
  cycle: Cycle;
  setCycle: (c: Cycle) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card p-1 text-xs font-medium">
      <button
        onClick={() => setCycle("monthly")}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          cycle === "monthly" ? "bg-secondary text-foreground" : "text-muted-foreground"
        )}
      >
        Monthly
      </button>
      <button
        onClick={() => setCycle("annual")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
          cycle === "annual" ? "bg-secondary text-foreground" : "text-muted-foreground"
        )}
      >
        Annual
        <Badge variant="success" className="px-1.5 py-0 text-[10px]">
          −20%
        </Badge>
      </button>
    </div>
  );
}

function Price({
  plan,
  cycle,
}: {
  plan: (typeof plans)[number];
  cycle: Cycle;
}) {
  if (plan.monthly === "custom") {
    return (
      <div className="relative mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">Custom</span>
      </div>
    );
  }

  const monthly = plan.monthly;
  const display = cycle === "annual" ? Math.round(monthly * 0.8) : monthly;
  const sub = cycle === "annual" ? `billed annually · ${monthly * 12 * 0.8}€/yr` : "billed monthly";

  return (
    <div className="relative mt-3">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">€{display}</span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
