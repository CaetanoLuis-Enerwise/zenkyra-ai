import {
  Briefcase,
  Headphones,
  Users2,
  Settings2,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const cases = [
  {
    icon: Briefcase,
    title: "Sales",
    headline: "Close 22% faster, on your playbook.",
    bullets: [
      "Auto-qualify and reply to inbound leads in your voice",
      "Draft proposals grounded on past closed-won deals",
      "Surface the right case study on every account",
    ],
    proof: "12 mins → 38 secs to draft a proposal",
  },
  {
    icon: Headphones,
    title: "Support",
    headline: "Cut handle-time by 41% without growing headcount.",
    bullets: [
      "Triage tickets by priority, sentiment and SLA",
      "Suggest grounded answers from SOPs in real time",
      "Escalate intelligently — not when the queue is long",
    ],
    proof: "7,200 tickets handled by AI agents last month",
  },
  {
    icon: Users2,
    title: "HR",
    headline: "Day-one-ready new hires across every office.",
    bullets: [
      "Onboarding co-pilot tailored to each role",
      "Instant answers on policies, benefits and IT",
      "Performance review drafts grounded on real data",
    ],
    proof: "Onboarding 2× faster, 38% fewer Slack questions",
  },
  {
    icon: Settings2,
    title: "Operations",
    headline: "Run the boring 30% of work — automatically.",
    bullets: [
      "SOPs, vendors, runbooks searchable in one place",
      "Invoice OCR + PO matching out of the box",
      "Meeting summaries posted to the right channel",
    ],
    proof: "1,284 hours saved this month at Acme",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="border-b border-border bg-secondary/30 py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Built for every team
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            One platform. Every department. Measurable outcomes.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            We start where the pain is loudest and expand horizontally as ROI compounds.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <Card key={c.title} className="group p-6 transition hover:border-brand/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      {c.title}
                    </p>
                    <h3 className="text-lg font-semibold">{c.headline}</h3>
                  </div>
                </div>
                <a
                  href="#"
                  className="inline-flex shrink-0 items-center gap-1 text-sm text-brand transition hover:underline"
                >
                  Template
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {c.proof}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
