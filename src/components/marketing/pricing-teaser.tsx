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
    description: "Hire your first agent. Best for small teams running pilots.",
    features: [
      "1 agent · pre-built role",
      "Up to 25 users",
      "20 GB Knowledge Hub",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "€799",
    description: "Build a digital workforce across multiple teams.",
    features: [
      "Up to 5 agents · custom workflows",
      "Up to 200 users",
      "200 GB Knowledge Hub",
      "Live ROI dashboard",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Private deployment with unlimited agents and full controls.",
    features: [
      "Unlimited agents · custom-built roles",
      "EU data residency · BYO LLM",
      "SSO + SCIM",
      "SOC 2 / ISO evidence",
      "Dedicated CSM + Solutions Engineer",
    ],
  },
];

export function PricingTeaser() {
  const open = useDemoDialog((s) => s.openDialog);
  return (
    <section id="pricing" className="section-marketing border-border bg-secondary/20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">Pricing</p>
          <h2 className="marketing-headline">
            Transparent pricing. ROI from week one.
          </h2>
          <p className="marketing-sub">
            Most customers reach 5×+ ROI within their first quarter — and we put that in writing on Enterprise.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
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
