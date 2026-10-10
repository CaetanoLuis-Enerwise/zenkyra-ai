const steps = [
  {
    day: "Day 1",
    title: "NDA signed, tenant provisioned",
    desc: "Private workspace provisioned. Hosting region confirmed in writing. DPA before any customer PDF.",
  },
  {
    day: "Day 2",
    title: "Knowledge Hub connected",
    desc: "Upload the documents you choose. Integrations (Drive, Notion, Slack, SharePoint) are scoped per pilot.",
  },
  {
    day: "Day 3",
    title: "First agent hired",
    desc: "Pick Sales, Support, Ops or Finance. We tune voice and rules against your real workflows.",
  },
  {
    day: "Week 1",
    title: "Team trial",
    desc: "Your named users test the agent on real questions. We agree what to measure.",
  },
  {
    day: "Day 14",
    title: "Pilot review",
    desc: "We review the results with you on your data. You decide whether to continue on a plan.",
  },
];

export function WeekTimeline() {
  return (
    <section className="section-marketing border-border bg-secondary/25">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">The 14-day paid pilot</p>
          <h2 className="marketing-headline">
            What happens in the €149 pilot.
          </h2>
          <p className="marketing-sub">
            No 6-month implementation. A short, paid technical pilot on your own documents, then a decision.
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

        </div>
      </div>
    </section>
  );
}
