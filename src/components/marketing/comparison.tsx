import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Zenkyra-only capability list. "shipped" means implemented in the backend repo
 * (not independently audited); every "shipped" row has a code reference in
 * CHANGES.md. No competitor comparison: we only state what we can verify.
 */
type Status = "shipped" | "roadmap";

const rows: { label: string; desc: string; status: Status }[] = [
  {
    label: "Agent roles: Sales, Support, Ops",
    desc: "Agent runners per role, scoped to your tenant.",
    status: "shipped",
  },
  {
    label: "Answers grounded on your uploaded documents",
    desc: "PDFs are chunked, embedded and retrieved for each chat message.",
    status: "shipped",
  },
  {
    label: "Separate vector collection per tenant",
    desc: "Each company's documents are indexed in its own collection.",
    status: "shipped",
  },
  {
    label: "Finance and Executive Analyst agents",
    desc: "Shown in the product preview; not implemented in the backend yet.",
    status: "roadmap",
  },
  {
    label: "Page-level source citations",
    desc: "Showing which page each answer came from.",
    status: "roadmap",
  },
  {
    label: "Actions inside your CRM, ERP and helpdesk",
    desc: "Integrations are scoped per pilot.",
    status: "roadmap",
  },
  {
    label: "SSO / SCIM",
    desc: "Single sign-on and user provisioning via your IdP.",
    status: "roadmap",
  },
  {
    label: "Single-tenant VPC deployment",
    desc: "Running Zenkyra inside your own cloud account.",
    status: "roadmap",
  },
  {
    label: "Bring-your-own LLM",
    desc: "LLM processing today is Google Gemini.",
    status: "roadmap",
  },
];

export function Comparison() {
  return (
    <section className="section-marketing border-border bg-secondary/35">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">What is built today</p>
          <h2 className="marketing-headline">Shipped vs roadmap — no surprises.</h2>
          <p className="marketing-sub">
            A plain list of what exists in the product code today and what is still planned.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-elev">
          <div className="grid grid-cols-[1fr_auto] border-b border-border bg-secondary/40 text-xs font-medium">
            <div className="px-5 py-4 text-muted-foreground">Capability</div>
            <div className="px-5 py-4 text-muted-foreground">Status</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={cn(
                "grid grid-cols-[1fr_auto] items-center text-sm",
                i !== rows.length - 1 && "border-b border-border"
              )}
            >
              <div className="px-5 py-4">
                <p className="font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <div className="px-5 py-4">
                <StatusPill status={r.status} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          &quot;Shipped&quot; means implemented in our code, not independently audited. No SOC 2 yet.
        </p>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: Status }) {
  return status === "shipped" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
      Shipped (in code)
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Clock className="h-3.5 w-3.5" />
      Roadmap
    </span>
  );
}
