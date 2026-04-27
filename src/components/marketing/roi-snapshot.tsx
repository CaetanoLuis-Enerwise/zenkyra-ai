"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
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
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Build the business case
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              See your ROI before the demo even starts.
            </h2>
            <p className="mt-4 text-balance text-muted-foreground">
              Two sliders. Conservative model. Same math your CFO will run. We bring the detailed projection — sourced from 140+ deployments — to the call.
            </p>

            <div className="mt-7 space-y-3 text-sm text-muted-foreground">
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

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => open("roi")}>
                Get the full projection
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#pricing">See pricing</a>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Live estimate
              </p>
              <motion.p
                key={annual}
                initial={{ opacity: 0.6, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-2 text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl"
              >
                {formatCurrency(annual)}
              </motion.p>
              <p className="text-sm text-muted-foreground">
                projected annual savings
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-secondary/40 p-4">
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

              <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
                Conservative model. Median customer outperforms by 30%. We'll
                walk through your specifics live — DPA &amp; security pack
                included.
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
