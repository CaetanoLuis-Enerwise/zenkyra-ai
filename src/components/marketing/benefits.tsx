import { Bolt, ClipboardCheck, Lock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Bolt,
    title: "Answers in seconds",
    description:
      "Replace 30-minute searches with grounded answers in 4. Zenkyra cites every source, with page numbers.",
    metric: "−62%",
    metricLabel: "avg. response time",
  },
  {
    icon: ClipboardCheck,
    title: "Less admin, more selling",
    description:
      "Automate the repetitive 30% of every team’s week — quoting, triage, follow-ups, summaries.",
    metric: "+38%",
    metricLabel: "team productivity gain",
  },
  {
    icon: Lock,
    title: "Private by construction",
    description:
      "Single-tenant deployment, in-region encryption, no shared models. Your data never leaves your boundary.",
    metric: "0",
    metricLabel: "data leaks since 2023",
  },
  {
    icon: Users,
    title: "Day-one-ready people",
    description:
      "Every employee gets a senior teammate on demand. Onboarding gets 2× faster the same week.",
    metric: "2×",
    metricLabel: "faster onboarding",
  },
];

export function Benefits() {
  return (
    <section id="product" className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Why Zenkyra
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            The intelligence layer your company has been missing.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            One private platform. Every team faster. Security and procurement on board from day one.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
