import { Bot, ClipboardCheck, Lock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Bot,
    title: "Workers, not chatbots",
    description:
      "Each Zenkyra agent owns a real job — qualifying leads, resolving tickets, processing invoices, drafting board memos. They take action, not just answer.",
    metric: "5",
    metricLabel: "agent roles",
  },
  {
    icon: ClipboardCheck,
    title: "Reduce workload, scale operations",
    description:
      "Your workforce expands without expanding the org. Agents take repeatable work off your team; the pilot shows what that looks like on your own documents.",
    metric: "14 days",
    metricLabel: "paid technical pilot",
  },
  {
    icon: TrendingUp,
    title: "Outcomes the CFO can defend",
    description:
      "No published savings figure. During the pilot we agree what to measure, and you judge the result on your own data — not a press number.",
    metric: "€149",
    metricLabel: "pilot price, by invoice",
  },
  {
    icon: Lock,
    title: "Private by construction",
    description:
      "Each company gets its own tenant. LLM processing is done by Google Gemini; the hosting region is confirmed in writing before any upload.",
    metric: "DPA",
    metricLabel: "before any customer PDF",
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
