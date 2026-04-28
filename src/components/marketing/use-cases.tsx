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
    title: "Sales Agent",
    headline: "Qualify, reply, follow up — 24/7, in your voice.",
    bullets: [
      "Auto-score and reply to inbound leads under 90 seconds",
      "Draft proposals grounded on past closed-won deals",
      "Update your CRM and book the meeting",
    ],
    proof: "Northwind closed 22% faster after 9 weeks",
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
  },
  {
    icon: Users2,
    title: "Finance Agent + Executive Analyst",
    headline: "Close the books faster. Brief the board weekly.",
    bullets: [
      "Invoice OCR, PO matching and approval routing",
      "Variance analysis the second numbers land",
      "Board-ready briefings drafted every Monday",
    ],
    proof: "Vertex closes 4 days faster — every month",
  },
];

export function UseCases() {
  return (
    <section id="workflows" className="border-b border-border bg-secondary/30 py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            What each agent does
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            One platform. Every department. Measurable outcomes.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Hire the agent your team needs first. Add the rest as ROI compounds.
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
