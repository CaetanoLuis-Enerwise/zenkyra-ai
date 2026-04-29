"use client";

import {
  Briefcase,
  Headphones,
  Users2,
  Settings2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/components/marketing/demo-dialog";
import { cn } from "@/lib/utils";

const cases = [
  {
    icon: Briefcase,
    title: "Sales Agent",
    headline: "Qualify, reply, follow up — 24/7, in your voice.",
    bullets: [
      "Auto-score and reply to inbound leads under 90 seconds",
      "Draft proposals grounded on past closed-won deals",
      "Update your CRM and book the meeting",
    ],
    proof: "Northwind closed 22% faster after 9 weeks",
    accent:
      "hover:border-brand/40 hover:shadow-brand/10 hover:ring-brand/15",
    glow: "from-brand/35",
  },
  {
    icon: Headphones,
    title: "Support Agent",
    headline: "Resolve tier-1, escalate only what matters.",
    bullets: [
      "Triage tickets by priority, sentiment and SLA",
      "Draft grounded answers with page-level citations",
      "Escalate intelligently — not when the queue is long",
    ],
    proof: "9,420 tickets handled · CSAT 4.9",
    accent:
      "hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:ring-emerald-500/15",
    glow: "from-emerald-500/35",
  },
  {
    icon: Settings2,
    title: "Ops Agent",
    headline: "Run the boring 30% — automatically.",
    bullets: [
      "Internal requests routed and resolved on-policy",
      "SOPs and runbooks executed end-to-end",
      "Vendor + procurement triage in Slack and Teams",
    ],
    proof: "1,200+ hrs saved monthly per 100 employees",
    accent:
      "hover:border-amber-500/40 hover:shadow-amber-500/10 hover:ring-amber-500/15",
    glow: "from-amber-500/35",
  },
  {
    icon: Users2,
    title: "Finance + Analyst",
    headline: "Close the books faster. Brief the board weekly.",
    bullets: [
      "Invoice OCR, PO matching and approval routing",
      "Variance analysis the second numbers land",
      "Board-ready briefings drafted every Monday",
    ],
    proof: "Vertex closes 4 days faster — every month",
    accent:
      "hover:border-violet-500/40 hover:shadow-violet-500/10 hover:ring-violet-500/15",
    glow: "from-violet-500/35",
  },
];

export function UseCases() {
  const open = useDemoDialog((s) => s.openDialog);

  return (
    <section
      id="workflows"
      className="section-marketing border-border bg-secondary/35"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="marketing-eyebrow">Deep-dive use cases</p>
          <h2 className="marketing-headline">
            One platform. Every department. Measurable outcomes.
          </h2>
          <p className="marketing-sub">
            Hire the agent your pain demands first — compound ROI before you
            expand the footprint.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.42, delay: i * 0.05 }}
            >
              <Card
                className={cn(
                  "group relative h-full overflow-hidden border bg-card/95 p-7 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  c.accent
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100",
                    c.glow
                  )}
                />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-inner ring-1 ring-brand/15">
                      <c.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {c.title}
                      </p>
                      <h3 className="mt-1.5 text-xl font-semibold leading-snug tracking-tight">
                        {c.headline}
                      </h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-1 text-brand hover:bg-brand/10 hover:text-brand"
                    onClick={() => open(`use-case-${c.title}`)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    See demo flow
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>

                <ul className="relative mt-6 space-y-3 border-t border-border pt-6">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[15px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                      <span className="leading-relaxed text-muted-foreground">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  {c.proof}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
