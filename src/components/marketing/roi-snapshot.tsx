"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Clock, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/components/marketing/demo-dialog";
import { formatCurrency } from "@/lib/utils";

/**
 * Conservative ROI model:
 *   - Each knowledge worker spends ~5 hours/week on tasks Zenkyra automates.
 *   - Zenkyra reclaims ~62% of that time (validated across 140+ deployments).
 *   - Annual savings = users × hourly cost × 5 × 0.62 × 48 weeks.
 */
export function RoiSnapshot() {
  const open = useDemoDialog((s) => s.openDialog);
  const [users, setUsers] = React.useState(120);
  const [hourly, setHourly] = React.useState(55);

  const annual = Math.round(users * hourly * 5 * 0.62 * 48);
  const monthly = Math.round(annual / 12);
  const hours = Math.round(users * 5 * 0.62 * 48);

  return (
    <section className="section-marketing border-border bg-gradient-to-b from-background via-secondary/25 to-background">
      <div className="container">
        <div className="mx-auto mb-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <Badge
            variant="secondary"
            className="gap-1.5 border border-brand/20 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand"
          >
            <Zap className="h-3 w-3" />
            CFO-ready model · interactive teaser
          </Badge>
          <span className="text-xs text-muted-foreground">
            Bring your actual headcount — we reconcile assumptions live on the Executive Demo.
          </span>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="marketing-eyebrow">Build the business case</p>
            <h2 className="marketing-headline max-w-xl">
              Model enterprise ROI before Legal finishes redlining.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Two sliders — conservative benchmarks from 140+ deployments. Same math your CFO runs in diligence; we validate inputs live.
            </p>

            <div className="mt-9 space-y-3 text-sm text-muted-foreground">
              <Row icon={<Calculator className="h-4 w-4 text-brand" />}>
                Sourced from validated benchmarks across SaaS, finance, manufacturing and healthcare.
              </Row>
              <Row icon={<Clock className="h-4 w-4 text-brand" />}>
                Assumes 5 hours/week of automatable work per knowledge worker.
              </Row>
              <Row icon={<TrendingUp className="h-4 w-4 text-brand" />}>
                Time reclaimed: ~62% — verified by post-pilot audits.
              </Row>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => open("roi")} className="gap-2 shadow-md shadow-brand/15">
                Lock your ROI session this week
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#pricing">See pricing</a>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden border-brand/15 p-6 shadow-xl shadow-brand/10 ring-1 ring-brand/10 sm:p-9">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 animate-pulse-slow rounded-full bg-brand/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                  Live estimate
                </p>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Conservative scenario
                </span>
              </div>
              <motion.p
                key={annual}
                initial={{ opacity: 0.65, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="mt-4 text-5xl font-semibold tracking-tight text-foreground tabular-nums sm:text-6xl"
              >
                {formatCurrency(annual)}
              </motion.p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                projected annual labour arbitrage
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-secondary/50 p-4 backdrop-blur-sm">
                <Mini label="Monthly savings" value={formatCurrency(monthly)} />
                <Mini label="Hours reclaimed / yr" value={hours.toLocaleString("en-US")} />
              </div>

              <div className="mt-6 space-y-5">
                <Slider
                  label="Knowledge workers"
                  value={users}
                  min={10}
                  max={2000}
                  step={10}
                  onChange={setUsers}
                  suffix=" people"
                />
                <Slider
                  label="Avg. fully-loaded hourly cost"
                  value={hourly}
                  min={20}
                  max={150}
                  step={5}
                  onChange={setHourly}
                  prefix="€"
                />
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
                Conservative baseline — median deployments outperform within two quarters.
                Executive Demo ships model workbook + security pack.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {prefix}
          {value.toLocaleString("en-US")}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="zenkyra-range"
        aria-label={label}
      />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
