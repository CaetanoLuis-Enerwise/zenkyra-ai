import { LiveNotConnected } from "@/components/live/live-not-connected";
import { LIVE_MODE } from "@/lib/config";
import type * as React from "react";
import {
  ShieldCheck,
  Lock,
  ScrollText,
  KeyRound,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

// Status is what is true today, not a target. "In code" = implemented in the backend
// repo, not independently audited. Update only with evidence.
type CardStatus = "In code" | "To confirm" | "Roadmap";

const cards: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: CardStatus;
}[] = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Tenant Isolation",
    description:
      "Each company is its own tenant, with a separate vector collection per tenant. No independent audit yet.",
    status: "In code",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Encryption",
    description:
      "Encryption in transit and at rest depends on the hosting provider and is confirmed in writing before any upload. Customer-managed keys are not offered.",
    status: "To confirm",
  },
  {
    icon: <ScrollText className="h-5 w-5" />,
    title: "Audit Logs",
    description:
      "LLM calls are logged per tenant. A full, exportable audit trail of every query and document access is planned.",
    status: "Roadmap",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "Role-based access",
    description:
      "Owner, admin and member roles. SSO and SCIM provisioning via your IdP are on the roadmap, not shipped.",
    status: "In code",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Hosting region & sub-processors",
    description:
      "Hosting region confirmed in writing before any upload. LLM processing by Google Gemini. Sub-processor list and DPA before any customer PDF.",
    status: "To confirm",
  },
];

const compliance = [
  "No SOC 2 yet",
  "EU-first",
  "DPA before any customer PDF",
  "Private tenant",
];

async function MockSecurityPage() {
  const events = await api.audit();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trust posture"
        title="Security & Trust"
        description="What is in place today, what we confirm in writing before you upload, and what is still roadmap."
        meta={
          <>
            <span>No SOC 2 yet</span>
            <span className="hidden md:inline">·</span>
            <span>Hosting region: confirmed in writing before any upload</span>
          </>
        }
        actions={
          <Button variant="outline" size="sm">
            Request DPA
          </Button>
        }
      />

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Badge variant="muted">Honest status · early-stage product</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Your private knowledge, in your own tenant.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Zenkyra AI is early-stage. We do not hold certifications yet. Before any customer PDF we sign a DPA, confirm the hosting region in writing and list our sub-processors, including Google Gemini for LLM processing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {compliance.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title} className="p-5 transition hover:border-brand/30">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                {c.icon}
              </span>
              <Badge variant={c.status === "In code" ? "success" : "muted"}>{c.status}</Badge>
            </div>
            <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-4 w-4 text-brand" />
              Recent audit events
            </h3>
            <p className="text-sm text-muted-foreground">
              Sample events on demo data — not a live log.
            </p>
          </div>
          <Button variant="outline" size="sm">
            View full log
          </Button>
        </div>
        <ol className="relative mt-5 space-y-4 border-l border-border pl-6">
          {events.map((e) => (
            <li key={e.id} className="relative">
              <span
                className={
                  e.severity === "warning"
                    ? "absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warning/15 ring-2 ring-background"
                    : "absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand/15 ring-2 ring-background"
                }
              >
                {e.severity === "warning" ? (
                  <AlertTriangle className="h-2.5 w-2.5 text-warning" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                )}
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-medium">{e.event}</p>
                <span className="text-xs text-muted-foreground">{e.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{e.detail}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">by {e.actor}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

// NEXT_PUBLIC_API_URL set → live tenant data (or an honest "not connected" state); unset → demo data.
export default function SecurityPage() {
  return LIVE_MODE ? <LiveNotConnected title="Security" /> : <MockSecurityPage />;
}
