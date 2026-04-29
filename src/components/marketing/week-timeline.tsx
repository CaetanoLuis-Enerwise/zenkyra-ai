import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    day: "Day 1",
    title: "NDA signed, tenant provisioned",
    desc: "Private workspace live in Frankfurt or Lisbon. Trust pack and DPA delivered to your inbox.",
  },
  {
    day: "Day 2",
    title: "Knowledge Hub connected",
    desc: "Drop documents or sync Drive, Notion, Slack, SharePoint, ERP. Embeddings finish overnight inside your tenant.",
  },
  {
    day: "Day 3",
    title: "First agent hired",
    desc: "Pick Sales, Support, Ops or Finance. We co-tune voice, rules and integrations against your real workflows.",
  },
  {
    day: "Day 5",
    title: "Workforce on duty",
    desc: "10 named users · SSO live · audit trail flowing. The agent ships its first measurable hours saved.",
  },
  {
    day: "Day 7",
    title: "Production handoff",
    desc: "Executive ROI dashboard, rollback runbook and CSM sync — your workforce from here.",
  },
];

export function WeekTimeline() {
  return (
    <section className="section-marketing border-border bg-secondary/25">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">From signed NDA to working agent</p>
          <h2 className="marketing-headline">
            Hire your first agent in 7 days.
          </h2>
          <p className="marketing-sub">
            No 6-month implementation. No army of consultants. Zenkyra is engineered to put a working agent on shift before your next board meeting.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-brand/40 via-border to-transparent md:left-1/2" />
          <ol className="space-y-8 md:space-y-10">
            {steps.map((s, i) => (
              <li
                key={s.day}
                className="relative grid grid-cols-[24px_1fr] items-start gap-4 md:grid-cols-2 md:gap-12"
              >
                <span className="relative z-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-brand/40 bg-background md:order-none md:absolute md:left-1/2 md:-translate-x-1/2">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                </span>
                <div
                  className={
                    i % 2 === 0
                      ? "md:col-start-1 md:text-right md:pr-10"
                      : "md:col-start-2 md:pl-10"
                  }
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    {s.day}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-12 inline-flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Most pilots extend to a second agent within 14 days.
          </div>
        </div>
      </div>
    </section>
  );
}
