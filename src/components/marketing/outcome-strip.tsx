import { Banknote, ShieldCheck, FileCheck, Timer } from "lucide-react";
import { CountUp } from "@/components/app/count-up";

const outcomes = [
  {
    icon: ShieldCheck,
    value: "EU-first",
    label: "Private knowledge, your tenant",
  },
  {
    icon: Timer,
    value: "7 days",
    label: "Target for first agent live",
  },
  {
    icon: Banknote,
    value: "€149",
    label: "14-day paid technical pilot",
  },
  {
    icon: FileCheck,
    value: "DPA first",
    label: "Before any customer PDF",
  },
];

export function OutcomeStrip() {
  return (
    <section className="section-marketing-tight border-border bg-secondary/35">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
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
