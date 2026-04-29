import { Bot, ClipboardCheck, Lock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Bot,
    title: "Workers, not chatbots",
    description:
      "Each Zenkyra agent owns a real job — qualifying leads, resolving tickets, processing invoices, drafting board memos. They take action, not just answer.",
    metric: "5",
    metricLabel: "ready-to-hire agents",
  },
  {
    icon: ClipboardCheck,
    title: "Reduce workload, scale operations",
    description:
      "Your workforce expands without expanding the org. Average customer reclaims 1,200+ hours per 100 employees, every month.",
    metric: "+38%",
    metricLabel: "team productivity gain",
  },
  {
    icon: TrendingUp,
    title: "Outcomes the CFO can defend",
    description:
      "Live ROI dashboard with finance-grade exports. Money saved, hours reclaimed and revenue captured — measurable from week one.",
    metric: "7.4×",
    metricLabel: "average ROI · 9-week payback",
  },
  {
    icon: Lock,
    title: "Private by construction",
    description:
      "Single-tenant deployment, in-region encryption, no shared models. Your data, your rules, your audit trail — never leaves your boundary.",
    metric: "0",
    metricLabel: "data leaks since 2023",
  },
];

export function Benefits() {
  return (
    <section id="platform" className="section-marketing border-border">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">Why Zenkyra</p>
          <h2 className="marketing-headline">
            The first company that hires workers instead of seats.
          </h2>
          <p className="marketing-sub">
            One private platform. Every department gets a digital teammate. Security, finance and operations on board from day one.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {benefits.map((b) => (
            <Card key={b.title} className="group relative flex flex-col p-6 transition hover:border-brand/30">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand/15">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{b.description}</p>
              <div className="mt-5 border-t border-border pt-3">
                <p className="text-2xl font-semibold tracking-tight tabular-nums">
                  {b.metric}
                </p>
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  {b.metricLabel}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
