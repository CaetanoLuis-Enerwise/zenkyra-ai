import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell = "yes" | "partial" | "no";

const rows: {
  label: string;
  desc: string;
  values: [Cell, Cell, Cell, Cell];
}[] = [
  {
    label: "Performs work, not just chat",
    desc: "Autonomous agents that take action across your tools.",
    values: ["yes", "no", "partial", "partial"],
  },
  {
    label: "Pre-trained for business roles",
    desc: "Sales, Support, Ops, Finance, Executive Analyst.",
    values: ["yes", "no", "no", "no"],
  },
  {
    label: "Single-tenant deployment",
    desc: "Your data, your VPC, your encryption keys.",
    values: ["yes", "no", "no", "partial"],
  },
  {
    label: "Grounded on your knowledge",
    desc: "Every action cited with page-level sources.",
    values: ["yes", "partial", "partial", "partial"],
  },
  {
    label: "Bring-your-own LLM (Azure / AWS / OSS)",
    desc: "Full control of model, region and cost routing.",
    values: ["yes", "no", "no", "yes"],
  },
  {
    label: "EU-resident · SOC 2 · ISO 27001",
    desc: "Compliance evidence ready for procurement.",
    values: ["yes", "partial", "partial", "partial"],
  },
  {
    label: "First agent live in 7 days",
    desc: "Pilot in 24 hours. No engineering team needed.",
    values: ["yes", "yes", "partial", "no"],
  },
  {
    label: "Predictable, fixed pricing",
    desc: "No per-token surprises. Finance-friendly.",
    values: ["yes", "partial", "partial", "no"],
  },
];

const cols = ["Zenkyra", "ChatGPT Enterprise", "Microsoft Copilot", "DIY agents"];

export function Comparison() {
  return (
    <section className="section-marketing border-border bg-secondary/35">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">
            Why Zenkyra, not the alternatives
          </p>
          <h2 className="marketing-headline">
            Chat tools answer. Zenkyra agents work.
          </h2>
          <p className="marketing-sub">
            Most AI tools stop at the chat box. Zenkyra ships a digital workforce — autonomous agents engineered for the controls, evidence and uptime your enterprise actually requires.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-elev">
          <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] border-b border-border bg-secondary/40 text-xs font-medium">
            <div className="px-5 py-4 text-muted-foreground">Capability</div>
            {cols.map((c, i) => (
              <div
                key={c}
                className={cn(
                  "px-3 py-4 text-center",
                  i === 0
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-muted-foreground"
                )}
              >
                {c}
              </div>
            ))}
          </div>

          {rows.map((r, i) => (
            <div
              key={r.label}
              className={cn(
                "grid grid-cols-[1.6fr_repeat(4,1fr)] items-stretch text-sm",
                i !== rows.length - 1 && "border-b border-border"
              )}
            >
              <div className="px-5 py-4">
                <p className="font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              {r.values.map((v, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-center px-3 py-4",
                    idx === 0 && "bg-brand/[0.04]"
                  )}
                >
                  <Pip value={v} highlight={idx === 0} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Comparisons based on publicly available documentation as of Q1 2026. We're happy to walk through specifics on request.
        </p>
      </div>
    </section>
  );
}

function Pip({ value, highlight }: { value: Cell; highlight?: boolean }) {
  if (value === "yes")
    return (
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          highlight ? "bg-brand text-white" : "bg-success/15 text-success"
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  if (value === "partial")
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/15 text-warning">
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
      <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  );
}
