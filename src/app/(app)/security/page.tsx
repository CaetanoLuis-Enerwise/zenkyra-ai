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

const cards = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Tenant Isolation",
    description:
      "Every workspace runs on dedicated vector indexes and storage. No data is ever shared between tenants.",
    status: "Active",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Encryption",
    description:
      "AES-256 at rest, TLS 1.3 in transit, customer-managed keys available on Enterprise.",
    status: "Active",
  },
  {
    icon: <ScrollText className="h-5 w-5" />,
    title: "Audit Logs",
    description:
      "Every query, document access and model call is recorded with user attribution.",
    status: "Streaming",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "Role-based access",
    description:
      "Granular roles, permissions and SCIM provisioning via your IdP (Okta, Azure AD, Google).",
    status: "Configured",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "EU Data Residency",
    description:
      "Run Zenkyra in eu-west-1 (Lisbon) or eu-central-1 (Frankfurt). No cross-border transfers.",
    status: "Frankfurt",
  },
];

const compliance = [
  "SOC 2 Type II",
  "ISO 27001",
  "GDPR",
  "HIPAA-ready",
  "ISO 27701",
  "AI Act-aligned",
];

export default async function SecurityPage() {
  const events = await api.audit();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trust posture"
        title="Security & Trust"
        description="Built for the world's most regulated companies. Private deployment, encryption everywhere, audit everything."
        meta={
          <>
            <span>Last evidence sync · 14 minutes ago</span>
            <span className="hidden md:inline">·</span>
            <span>Region: eu-central-1</span>
          </>
        }
        actions={
          <Button variant="outline" size="sm">
            Download trust report
          </Button>
        }
      />

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Trust posture: Excellent
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Your private intelligence, fortified.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Zenkyra AI is designed from day one for enterprises that handle sensitive data. Private deployment, in-region storage and continuous compliance evidence.
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
              <Badge variant="success">
                <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
                {c.status}
              </Badge>
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
              Streamed in real time. Exportable to your SIEM.
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
