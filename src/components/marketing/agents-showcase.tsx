import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CircleDollarSign,
  Headphones,
  Settings2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const team = [
  {
    icon: Briefcase,
    name: "Sales Agent",
    tagline: "Qualifies leads, drafts replies, follows up.",
    metric: "612 hrs saved · this month",
    accent: "border-brand/30 ring-brand/20",
    glow: "from-brand/30",
    chip: "bg-brand/10 text-brand",
  },
  {
    icon: Headphones,
    name: "Support Agent",
    tagline: "Answers tickets, classifies issues, escalates.",
    metric: "1,184 hrs saved · 96% accuracy",
    accent: "border-emerald-500/30 ring-emerald-500/20",
    glow: "from-emerald-500/30",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Settings2,
    name: "Ops Agent",
    tagline: "Handles SOPs, internal requests, tasks.",
    metric: "318 hrs saved · 7-step playbooks",
    accent: "border-amber-500/30 ring-amber-500/20",
    glow: "from-amber-500/30",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: CircleDollarSign,
    name: "Finance Agent",
    tagline: "Processes invoices, summaries, reminders.",
    metric: "274 hrs saved · 99% match rate",
    accent: "border-violet-500/30 ring-violet-500/20",
    glow: "from-violet-500/30",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: BarChart3,
    name: "Executive Analyst",
    tagline: "Creates reports, detects trends, insights.",
    metric: "Weekly board briefings · auto-drafted",
    accent: "border-rose-500/30 ring-rose-500/20",
    glow: "from-rose-500/30",
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export function AgentsShowcase() {
  return (
    <section id="agents" className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Meet the workforce
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Five agents you can hire today.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Each agent ships pre-trained for a specific business job, integrates with your stack, and runs on your tenant. Custom agents in 7 days.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <Card
              key={m.name}
              className={cn(
                "group relative flex flex-col overflow-hidden p-6 ring-1 transition hover:-translate-y-0.5",
                m.accent,
                // Make the rose card span 1, but on mobile we want clean rows.
                i === 4 && "lg:col-span-1"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br to-transparent blur-2xl opacity-70 transition-opacity group-hover:opacity-100",
                  m.glow
                )}
              />
              <div className="relative flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    m.chip
                  )}
                >
                  <m.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Agent
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
                </div>
              </div>

              <p className="relative mt-5 text-sm text-muted-foreground">
                {m.tagline}
              </p>

              <div className="relative mt-6 flex items-center justify-between border-t border-border pt-4">
                <Badge variant="muted" className="text-[10px]">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
                  {m.metric}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  See what it does
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          ))}

          <Card className="group relative flex flex-col items-start justify-between p-6 transition hover:border-brand/40">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Custom agent
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">
                Need a different role?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Procurement, partner ops, legal review, recruiting — we co-design and ship a tailored agent into your tenant in under 7 days.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand">
              Brief us on your job <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Card>
        </div>
      </div>
    </section>
  );
}
