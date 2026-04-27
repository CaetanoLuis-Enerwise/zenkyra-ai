import { CircleDollarSign, ShieldCheck, Users2, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";

const personas = [
  {
    icon: ShieldCheck,
    role: "For the CIO",
    title: "Defensible by default.",
    bullets: [
      "Single-tenant deployment in your VPC or ours",
      "SOC 2 Type II, ISO 27001, HIPAA-ready, EU-resident",
      "SSO/SCIM, full audit trail, BYO-LLM",
    ],
    proof: "Average IT review cleared in 11 days",
  },
  {
    icon: CircleDollarSign,
    role: "For the CFO",
    title: "Predictable spend. Compounding ROI.",
    bullets: [
      "Fixed monthly price — no per-token surprises",
      "Live ROI dashboard with finance-grade exports",
      "Average 7.4× ROI · 9-week payback",
    ],
    proof: "€84M+ saved across customers to date",
  },
  {
    icon: Users2,
    role: "For the CHRO",
    title: "Day-one-ready people.",
    bullets: [
      "Onboarding co-pilot per role and office",
      "Instant answers on policy, payroll, IT and benefits",
      "Performance reviews drafted on grounded data",
    ],
    proof: "Onboarding 2× faster · 38% fewer Slack questions",
  },
  {
    icon: Workflow,
    role: "For the COO",
    title: "Run the boring 30% — automatically.",
    bullets: [
      "Triage, summarise, route — 24/7, in your tone",
      "SOPs, runbooks and vendors, instantly searchable",
      "1,200+ hours saved monthly per 100 employees",
    ],
    proof: "−62% average response time across teams",
  },
];

export function BuyingCommittee() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Built for the buying committee
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Every stakeholder gets the answer they need.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Most enterprise AI projects stall in committee. Zenkyra arrives pre-cleared by Security, pre-budgeted for Finance and pre-owned by the team that uses it.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {personas.map((p) => (
            <Card
              key={p.role}
              className="group flex flex-col p-6 transition hover:border-brand/30"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {p.role}
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                </div>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {p.proof}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
