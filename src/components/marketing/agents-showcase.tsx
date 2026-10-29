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
    tagline: "Classifies a lead. Does not send the email.",
    metric: "In the API",
    accent: "border-brand/30 ring-brand/20",
    glow: "from-brand/30",
    chip: "bg-brand/10 text-brand",
  },
  {
    icon: Headphones,
    name: "Support Agent",
    tagline: "Summarises ticket text. Does not update a helpdesk.",
    metric: "In the API",
    accent: "border-emerald-500/30 ring-emerald-500/20",
    glow: "from-emerald-500/30",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Settings2,
    name: "Ops Agent",
    tagline: "Drafts a checklist for an internal request.",
    metric: "In the API",
    accent: "border-amber-500/30 ring-amber-500/20",
    glow: "from-amber-500/30",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: CircleDollarSign,
    name: "Finance Agent",
    tagline: "Not a separate runner. Invoice processing is not shipped.",
    metric: "Roadmap",
    accent: "border-violet-500/30 ring-violet-500/20",
    glow: "from-violet-500/30",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: BarChart3,
    name: "Executive Analyst",
    tagline: "Not in the API.",
    metric: "Roadmap",
    accent: "border-rose-500/30 ring-rose-500/20",
    glow: "from-rose-500/30",
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export function AgentsShowcase() {
  return (
    <section id="agents" className="section-marketing border-border">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">Meet the workforce</p>
          <h2 className="marketing-headline">
            Three agent roles in the API. Two on the roadmap.
          </h2>
          <p className="marketing-sub">
            Sales, Support and Ops run in your tenant today. Finance and Executive Analyst are not built yet. Nothing here writes into a CRM, ERP or helpdesk.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
                Procurement, partner ops, legal review, recruiting — we scope a tailored agent with you during the pilot.
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
