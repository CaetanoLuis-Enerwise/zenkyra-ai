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
    title: "Workers you can underwrite.",
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
    title: "Scale operations, not headcount.",
    bullets: [
      "Hire agents per role — Sales, Support, Ops, Finance",
      "Every employee gets a senior teammate on demand",
      "Performance reviews drafted on grounded data",
    ],
    proof: "Onboarding 2× faster · 38% fewer Slack questions",
  },
  {
    icon: Workflow,
    role: "For the COO",
    title: "A workforce that doesn't sleep.",
    bullets: [
      "Triage, summarise, route — 24/7, in your tone",
      "SOPs, runbooks and vendors, instantly executable",
      "1,200+ hours saved monthly per 100 employees",
    ],
    proof: "−62% average response time across teams",
  },
];

export function BuyingCommittee() {
  return (
    <section className="section-marketing border-border">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">
            Built for the buying committee
          </p>
          <h2 className="marketing-headline">
            One workforce. Every executive sees their case.
          </h2>
          <p className="marketing-sub">
            Most enterprise AI projects stall in committee. Zenkyra arrives pre-cleared by Security, pre-budgeted for Finance and pre-owned by the team that hires the agent.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
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
