"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
  Database,
  FileSpreadsheet,
  FileText,
  Globe2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Workflow,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StepId = "workspace" | "sources" | "team" | "ready";

const STEPS: { id: StepId; title: string; description: string }[] = [
  {
    id: "workspace",
    title: "Workspace",
    description: "Tell us about your company.",
  },
  {
    id: "sources",
    title: "Connect knowledge",
    description: "Pick the systems your AI agents will ground on.",
  },
  {
    id: "team",
    title: "Invite your team",
    description: "Get the right people in from day one.",
  },
  {
    id: "ready",
    title: "Ready",
    description: "Your digital workforce is being provisioned.",
  },
];

const SOURCES = [
  { id: "drive", name: "Google Drive", desc: "Docs · Sheets · Slides", icon: <FileText className="h-5 w-5" /> },
  { id: "notion", name: "Notion", desc: "Wikis · Docs · Databases", icon: <FileText className="h-5 w-5" /> },
  { id: "sharepoint", name: "SharePoint", desc: "Microsoft 365 · OneDrive", icon: <FileSpreadsheet className="h-5 w-5" /> },
  { id: "slack", name: "Slack", desc: "Channels · Threads", icon: <Sparkles className="h-5 w-5" /> },
  { id: "salesforce", name: "Salesforce", desc: "CRM · Knowledge", icon: <Database className="h-5 w-5" /> },
  { id: "zendesk", name: "Zendesk", desc: "Tickets · Help center", icon: <Workflow className="h-5 w-5" /> },
];

const REGIONS = [
  { id: "eu-central-1", label: "EU · Frankfurt", desc: "Default · GDPR" },
  { id: "eu-west-1", label: "EU · Lisbon", desc: "Low-latency for IBE" },
  { id: "us-east-1", label: "US · N. Virginia", desc: "USD billing" },
  { id: "ap-southeast-1", label: "APAC · Singapore", desc: "Asia residency" },
];

export default function OnboardingPage() {
  const [stepIdx, setStepIdx] = React.useState(0);

  const [workspace, setWorkspace] = React.useState({
    company: "Acme Inc.",
    domain: "acme.io",
    industry: "Technology",
    size: "51–200",
    region: "eu-central-1",
  });

  const [sources, setSources] = React.useState<string[]>(["drive", "notion"]);
  const [invites, setInvites] = React.useState<string[]>([
    "alex@acme.io",
    "priya@acme.io",
  ]);
  const [draft, setDraft] = React.useState("");

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const isReadyStep = step.id === "ready";

  function next() {
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
  }
  function back() {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  }

  function toggleSource(id: string) {
    setSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function addInvite(email: string) {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (invites.includes(trimmed)) {
      toast.error("Already invited", { description: trimmed });
      return;
    }
    if (!/.+@.+\..+/.test(trimmed)) {
      toast.error("That doesn’t look like a valid email");
      return;
    }
    setInvites((prev) => [...prev, trimmed]);
    setDraft("");
  }

  return (
    <div className="container max-w-5xl py-10 lg:py-14">
      <Stepper steps={STEPS} current={stepIdx} />

      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-border bg-card/60 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Step {stepIdx + 1} of {STEPS.length}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{step.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
        </div>

        <div className="px-6 py-6 lg:px-10 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {step.id === "workspace" && (
                <WorkspaceStep
                  state={workspace}
                  onChange={setWorkspace}
                  regions={REGIONS}
                />
              )}
              {step.id === "sources" && (
                <SourcesStep
                  sources={SOURCES}
                  selected={sources}
                  onToggle={toggleSource}
                />
              )}
              {step.id === "team" && (
                <TeamStep
                  invites={invites}
                  onRemove={(e) => setInvites((p) => p.filter((x) => x !== e))}
                  draft={draft}
                  setDraft={setDraft}
                  onAdd={() => addInvite(draft)}
                />
              )}
              {step.id === "ready" && (
                <ReadyStep
                  workspace={workspace}
                  sources={sources}
                  inviteCount={invites.length}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-card/60 px-6 py-4">
          {stepIdx === 0 ? (
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" onClick={back} disabled={isReadyStep}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {isReadyStep ? (
            <Button asChild>
              <Link href="/overview">
                Open Overview
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button onClick={next} disabled={isLast}>
              {stepIdx === STEPS.length - 2 ? "Finish setup" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your data never leaves your tenant. Zenkyra is SOC 2 Type II, ISO 27001, GDPR compliant.
      </p>
    </div>
  );
}

function Stepper({
  steps,
  current,
}: {
  steps: typeof STEPS;
  current: number;
}) {
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((s, i) => {
        const status = i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <li key={s.id} className="relative">
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 transition-colors",
                status === "active"
                  ? "border-brand/30 bg-brand/5"
                  : status === "done"
                    ? "border-border bg-card"
                    : "border-border/60 bg-card/40"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                  status === "done"
                    ? "bg-success text-white"
                    : status === "active"
                      ? "bg-brand text-white"
                      : "bg-secondary text-muted-foreground"
                )}
              >
                {status === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="truncate text-xs text-muted-foreground">{s.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function WorkspaceStep({
  state,
  onChange,
  regions,
}: {
  state: {
    company: string;
    domain: string;
    industry: string;
    size: string;
    region: string;
  };
  onChange: (s: typeof state) => void;
  regions: { id: string; label: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Company name">
            <Input
              value={state.company}
              onChange={(e) => onChange({ ...state, company: e.target.value })}
              placeholder="e.g. Acme Inc."
            />
          </Field>
          <Field label="Email domain">
            <Input
              value={state.domain}
              onChange={(e) => onChange({ ...state, domain: e.target.value })}
              placeholder="acme.io"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Industry">
            <select
              value={state.industry}
              onChange={(e) => onChange({ ...state, industry: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Technology</option>
              <option>Financial services</option>
              <option>Healthcare</option>
              <option>Energy & utilities</option>
              <option>Manufacturing</option>
              <option>Retail</option>
              <option>Public sector</option>
            </select>
          </Field>
          <Field label="Team size">
            <select
              value={state.size}
              onChange={(e) => onChange({ ...state, size: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>1–10</option>
              <option>11–50</option>
              <option>51–200</option>
              <option>201–1000</option>
              <option>1000+</option>
            </select>
          </Field>
        </div>

        <div>
          <Label className="text-sm">Data residency</Label>
          <p className="text-xs text-muted-foreground">
            Where your knowledge and embeddings will live. Cannot be changed after provisioning.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {regions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onChange({ ...state, region: r.id })}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                  state.region === r.id
                    ? "border-brand/40 bg-brand/5"
                    : "border-border bg-card hover:border-brand/30"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Globe2 className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
                {state.region === r.id && <Check className="h-4 w-4 text-brand" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="h-fit p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          What you’re getting
        </p>
        <h3 className="mt-2 text-lg font-semibold">A private Zenkyra tenant</h3>
        <ul className="mt-4 space-y-2.5 text-sm">
          <Bullet icon={<ShieldCheck className="h-4 w-4 text-brand" />}>
            Tenant-isolated vector store and storage
          </Bullet>
          <Bullet icon={<Lock className="h-4 w-4 text-brand" />}>
            AES-256 at rest · TLS 1.3 in transit
          </Bullet>
          <Bullet icon={<Globe2 className="h-4 w-4 text-brand" />}>
            Resident in your selected region
          </Bullet>
          <Bullet icon={<Sparkles className="h-4 w-4 text-brand" />}>
            27 automation templates ready to deploy
          </Bullet>
        </ul>
      </Card>
    </div>
  );
}

function SourcesStep({
  sources,
  selected,
  onToggle,
}: {
  sources: typeof SOURCES;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => {
          const active = selected.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onToggle(s.id)}
              className={cn(
                "group relative flex items-start gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-brand/40 bg-brand/5 shadow-elev"
                  : "border-border bg-card hover:border-brand/30"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-brand text-white" : "bg-secondary text-foreground"
                )}
              >
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-border text-transparent group-hover:border-brand/40"
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      <Card className="flex items-center justify-between gap-4 border-dashed bg-card/40 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <CloudUpload className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Or upload documents directly</p>
            <p className="text-xs text-muted-foreground">
              We index PDFs, DOCX, XLSX, MD up to 200 GB.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/knowledge">Open knowledge base</Link>
        </Button>
      </Card>

      <p className="text-xs text-muted-foreground">
        Selected {selected.length} {selected.length === 1 ? "source" : "sources"}. You can connect more anytime from Settings → Integrations.
      </p>
    </div>
  );
}

function TeamStep({
  invites,
  onRemove,
  draft,
  setDraft,
  onAdd,
}: {
  invites: string[];
  onRemove: (e: string) => void;
  draft: string;
  setDraft: (s: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Field label="Invite by email">
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAdd();
                }
              }}
              placeholder="name@company.com"
            />
            <Button type="button" onClick={onAdd}>
              <UserPlus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            They’ll receive a magic link in their inbox. Press Enter to add multiple at once.
          </p>
        </Field>

        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-card/40 px-3 py-2 text-xs">
            <span className="font-semibold uppercase tracking-wide text-muted-foreground">
              Pending invites
            </span>
            <Badge variant="secondary">{invites.length}</Badge>
          </div>
          <ul className="divide-y divide-border">
            {invites.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{email}</span>
                  <Badge variant="muted" className="text-[10px]">User</Badge>
                </div>
                <button
                  onClick={() => onRemove(email)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label={`Remove ${email}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
            {invites.length === 0 && (
              <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                No invites yet — you can always add teammates later from Team settings.
              </li>
            )}
          </ul>
        </div>
      </div>

      <Card className="h-fit p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Pro tip
        </p>
        <h3 className="mt-2 text-base font-semibold">Start with one champion per team</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Customers who invite at least one Sales, Support and Ops champion in week one see <span className="font-semibold text-foreground">3.2× faster</span> adoption.
        </p>
        <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
          You can promote anyone to <span className="font-medium text-foreground">Admin</span> later. SCIM provisioning is available on Enterprise.
        </div>
      </Card>
    </div>
  );
}

function ReadyStep({
  workspace,
  sources,
  inviteCount,
}: {
  workspace: {
    company: string;
    region: string;
  };
  sources: string[];
  inviteCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success"
        >
          <Check className="h-8 w-8" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          {workspace.company} is provisioning.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your private tenant is being provisioned in <span className="font-medium text-foreground">{workspace.region}</span>. Expect indexing to complete in the next few minutes — we’ll email you when it’s ready.
        </p>

        <div className="mt-6 space-y-2 text-sm">
          <Provisioning label="Tenant created" done />
          <Provisioning label="Vector index initialized" done />
          <Provisioning label={`${sources.length} integration${sources.length === 1 ? "" : "s"} authorizing`} loading />
          <Provisioning label={`${inviteCount} invite${inviteCount === 1 ? "" : "s"} queued`} done />
          <Provisioning label="First-run automations deploying" loading />
        </div>
      </div>

      <Card className="h-fit p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          What to do next
        </p>
        <ul className="mt-3 space-y-3 text-sm">
          <NextLink href="/agents" title="Activate your first agent" desc="Sales, Support, Ops, Finance — pick one." />
          <NextLink href="/knowledge" title="Upload a document" desc="Knowledge Hub will train every agent." />
          <NextLink href="/workflows" title="Wire a workflow" desc="Lead → Sales Agent → Email → CRM." />
        </ul>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}

function Provisioning({
  label,
  done = false,
  loading = false,
}: {
  label: string;
  done?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-3 w-3" />
        </span>
      ) : loading ? (
        <span className="flex h-5 w-5 items-center justify-center">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </span>
      ) : (
        <span className="h-5 w-5 rounded-full border border-border" />
      )}
      <span className={done ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
}

function NextLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition hover:border-brand/30 hover:bg-accent/50"
      >
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </li>
  );
}
