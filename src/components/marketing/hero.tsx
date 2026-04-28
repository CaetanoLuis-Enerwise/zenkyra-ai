"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
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
            <span>Trusted by COOs &amp; CIOs at 140+ enterprises</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]"
          >
            Hire your first
            <span className="block bg-gradient-to-br from-brand via-brand-400 to-brand-300 bg-clip-text text-transparent">
              digital workforce.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            Zenkyra AI gives companies autonomous AI agents that reduce workload, increase speed and scale operations — privately, in your tenant. Ship the first agent in 7 days. Average payback in 9 weeks.
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
              Book Executive Demo
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
              First agent live in 7 days
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
            <Stat value="9 wks" label="Payback" />
            <Stat value="99.94%" label="Agent uptime" />
          </motion.div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  const agents = [
    { name: "Sales Agent", status: "active", tasks: "4,812 tasks", color: "from-brand/30 to-brand/0", dot: "bg-brand" },
    { name: "Support Agent", status: "active", tasks: "9,420 tasks", color: "from-emerald-500/30 to-emerald-500/0", dot: "bg-emerald-500" },
    { name: "Ops Agent", status: "active", tasks: "2,104 tasks", color: "from-amber-500/30 to-amber-500/0", dot: "bg-amber-500" },
    { name: "Finance Agent", status: "active", tasks: "1,864 tasks", color: "from-violet-500/30 to-violet-500/0", dot: "bg-violet-500" },
    { name: "Executive Analyst", status: "training", tasks: "312 tasks", color: "from-rose-500/30 to-rose-500/0", dot: "bg-rose-500" },
  ];
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
          <span className="ml-3 text-xs text-muted-foreground">acme · Zenkyra workforce</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
            Live · EU-Frankfurt
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Active workforce
            </p>
            <span className="text-[10px] text-muted-foreground">5 agents · 4 on shift</span>
          </div>

          <ul className="space-y-1.5">
            {agents.map((a, i) => (
              <motion.li
                key={a.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card/60 px-3 py-2"
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r ${a.color}`}
                />
                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card text-foreground/80">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="relative min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{a.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{a.tasks}</p>
                </div>
                <span className="relative inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${a.dot} ${a.status === "active" ? "animate-pulse-slow" : ""}`} />
                  {a.status === "active" ? "On shift" : "Training"}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Most recent · 2 min ago
            </p>
            <p className="mt-1 flex items-start gap-2 text-xs leading-5">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>
                <b>Sales Agent</b> qualified <b>Northwind Logistics</b> · scored 87/100 and booked a 30-min discovery call for Thursday 14:00.
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
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
