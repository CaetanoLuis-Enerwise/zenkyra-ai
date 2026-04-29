"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CircleDollarSign,
  Headphones,
  Settings2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const flows = [
  {
    icon: Briefcase,
    title: "Revenue acceleration",
    chain: ["Inbound lead", "Sales Agent", "Email + CRM"],
    accent: "from-brand/25 via-brand/5 to-transparent",
    ring: "hover:border-brand/35 hover:shadow-brand/10",
  },
  {
    icon: CircleDollarSign,
    title: "Finance velocity",
    chain: ["Invoice upload", "Finance Agent", "ERP posting"],
    accent: "from-violet-500/25 via-violet-500/5 to-transparent",
    ring: "hover:border-violet-500/35 hover:shadow-violet-500/10",
  },
  {
    icon: Headphones,
    title: "Customer experience",
    chain: ["Ticket opened", "Support Agent", "Resolved + QA"],
    accent: "from-emerald-500/25 via-emerald-500/5 to-transparent",
    ring: "hover:border-emerald-500/35 hover:shadow-emerald-500/10",
  },
  {
    icon: Settings2,
    title: "Operations backbone",
    chain: ["Internal request", "Ops Agent", "SOP execution"],
    accent: "from-amber-500/25 via-amber-500/5 to-transparent",
    ring: "hover:border-amber-500/35 hover:shadow-amber-500/10",
  },
];

export function WorkflowSpotlight() {
  return (
    <section className="section-marketing-tight border-border bg-secondary/25">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="marketing-eyebrow">Representative deployments</p>
          <h2 className="marketing-headline">
            Agent-led workflows your teams recognise.
          </h2>
          <p className="marketing-sub">
            Visual automation builder on top — wire triggers, approvals and
            human-in-the-loop where regulation demands it.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {flows.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-24px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card
                className={cn(
                  "group relative h-full overflow-hidden border bg-card/80 p-5 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                  f.ring
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-70 blur-2xl transition-opacity group-hover:opacity-100",
                    f.accent
                  )}
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Use case
                    </p>
                    <h3 className="mt-1 text-base font-semibold tracking-tight">
                      {f.title}
                    </h3>
                  </div>
                </div>
                <div className="relative mt-5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  {f.chain.map((step, j) => (
                    <span key={step} className="flex items-center gap-1.5">
                      {j > 0 && (
                        <ArrowRight className="h-3 w-3 shrink-0 text-brand/70" />
                      )}
                      <span className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-medium text-foreground/90">
                        {step}
                      </span>
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
