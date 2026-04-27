"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

export function Hero() {
  const open = useDemoDialog((s) => s.openDialog);
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4] mask-fade-b" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
      <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span className="flex items-center gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </span>
            <span>Rated 4.9 by COOs &amp; CIOs at 140+ enterprises</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]"
          >
            Your company already has knowledge.
            <span className="block bg-gradient-to-br from-brand via-brand-400 to-brand-300 bg-clip-text text-transparent">
              We turn it into intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            Zenkyra is the private AI platform that grounds every answer on your documents, deploys agents that act on your business, and lives entirely inside your tenant. Pilot live in 7 days. Average payback in 9 weeks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              size="xl"
              onClick={() => open("hero")}
              className="group relative overflow-hidden"
            >
              <CalendarCheck className="h-4 w-4" />
              Book a 30-min demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              />
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/onboarding">Start free pilot</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-xs text-muted-foreground"
          >
            No credit card · No procurement needed for pilot · Exit anytime
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" />
              SOC 2 Type II · ISO 27001 · GDPR
            </li>
            <li className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-brand" />
              Live in 7 days · pilot in 24h
            </li>
            <li className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand" />
              Private tenant · EU-resident
            </li>
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6"
          >
            <Stat value="7.4×" label="Avg. ROI" />
            <Stat value="−62%" label="Response time" />
            <Stat value="99.99%" label="Uptime SLA" />
          </motion.div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute -inset-x-8 -inset-y-12 -z-10 bg-gradient-to-tr from-brand/20 via-transparent to-transparent blur-3xl" />
      <div className="rounded-2xl border border-border bg-card shadow-elev">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 text-xs text-muted-foreground">acme · Zenkyra</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
            Live · EU-Frankfurt
          </span>
        </div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="space-y-1.5 border-r border-border p-3 text-xs">
            {["Dashboard", "Knowledge", "Assistant", "Automations", "Workflows", "Analytics"].map(
              (s, i) => (
                <div
                  key={s}
                  className={
                    i === 2
                      ? "flex items-center gap-2 rounded-md bg-accent px-2 py-1.5 font-medium"
                      : "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground"
                  }
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand/70" />
                  {s}
                </div>
              )
            )}
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <span className="h-7 w-7 shrink-0 rounded-full bg-secondary" />
              <div className="rounded-lg bg-secondary px-3 py-2 text-xs">
                Compare last year's discounting bands for our EMEA enterprise deals.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs leading-5 shadow-sm">
                  Median discount was <b>18.4%</b> in 2025. Deals above €120k jumped to <b>24.6%</b>. I'd tighten Tier-2 thresholds by 3 pts and bundle Support+SLA…
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Source label="Sales Playbook · p.24" />
                  <Source label="Annual Forecast · p.3" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              Ask anything about your company knowledge…
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Source({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px]">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {label}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
