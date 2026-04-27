"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

const plans = [
  {
    name: "Starter",
    price: "€299",
    description: "For small teams getting started with private AI.",
    features: [
      "Up to 25 users",
      "5,000 queries / month",
      "20 GB knowledge storage",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "€799",
    description: "For scaling companies that need full automation.",
    features: [
      "Up to 200 users",
      "Unlimited queries",
      "200 GB storage",
      "Custom workflows",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Private deployment with full controls.",
    features: [
      "Unlimited users",
      "EU data residency",
      "SSO + SCIM",
      "SOC 2 / ISO evidence",
      "Dedicated CSM",
    ],
  },
];

export function PricingTeaser() {
  const open = useDemoDialog((s) => s.openDialog);
  return (
    <section id="pricing" className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Pricing
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Transparent pricing. ROI from week one.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Most customers reach 5×+ ROI within their first quarter — and we put that in writing on Enterprise.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                {p.highlight && <Badge variant="default">Most popular</Badge>}
              </div>
              <div className="relative mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{p.price}</span>
                {p.price !== "Custom" && (
                  <span className="text-sm text-muted-foreground">/ month</span>
                )}
              </div>
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
                {p.name === "Enterprise" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => open("pricing-enterprise")}
                  >
                    Talk to sales
                  </Button>
                ) : (
                  <Button
                    variant={p.highlight ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href="/onboarding">Start with {p.name}</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Free 14-day pilot available on every plan · No credit card · Procurement-ready paperwork
        </p>
      </div>
    </section>
  );
}
