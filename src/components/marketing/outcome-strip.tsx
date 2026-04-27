import { Banknote, MessageSquare, Timer, TrendingUp } from "lucide-react";
import { CountUp } from "@/components/app/count-up";

const outcomes = [
  {
    icon: Banknote,
    value: "€84.2M",
    label: "Customer cost savings to date",
  },
  {
    icon: MessageSquare,
    value: "4,217,840",
    label: "Grounded answers delivered",
  },
  {
    icon: TrendingUp,
    value: "7.4×",
    label: "Average ROI in first quarter",
  },
  {
    icon: Timer,
    value: "9 weeks",
    label: "Average payback period",
  },
];

export function OutcomeStrip() {
  return (
    <section className="border-b border-border bg-secondary/30 py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {outcomes.map((o) => (
            <div key={o.label} className="flex flex-col gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <o.icon className="h-4 w-4" />
              </span>
              <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                <CountUp value={o.value} />
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">{o.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
