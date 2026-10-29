"use client";

import * as React from "react";
import { create } from "zustand";
import { AlertCircle, ArrowRight, Clock, Globe2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { leadFormConsent } from "@/lib/privacy";

/** What the visitor asked for. Matches the backend's LeadCreate.source. */
export type LeadKind = "demo" | "pilot";

interface DemoState {
  open: boolean;
  /** Where on the page the dialog was opened from (analytics only, not sent). */
  source?: string;
  kind: LeadKind;
  openDialog: (source?: string, kind?: LeadKind) => void;
  setOpen: (v: boolean) => void;
}

export const useDemoDialog = create<DemoState>((set) => ({
  open: false,
  source: undefined,
  kind: "demo",
  openDialog: (source, kind = "demo") => set({ open: true, source, kind }),
  setOpen: (v) => set({ open: v }),
}));

// Read at build time (NEXT_PUBLIC_* are inlined by Next.js). Both empty by default.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");
const SALES_EMAIL = (process.env.NEXT_PUBLIC_SALES_EMAIL ?? "").trim();

type Channel = "api" | "mailto" | "closed";
const CHANNEL: Channel = API_URL ? "api" : SALES_EMAIL ? "mailto" : "closed";

const SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

const LIMITS = { name: 120, company: 200, message: 2000 } as const;

const COPY: Record<LeadKind, { title: string; description: string; submit: string }> = {
  demo: {
    title: "Book your Executive Demo",
    description:
      "30 minutes. See a Zenkyra workspace on demo data, with an illustrative labour-arbitrage model — not a claimed ROI.",
    submit: "Request demo",
  },
  pilot: {
    title: "Start the €149 pilot",
    description:
      "14-day paid technical pilot, €149 plus VAT, by invoice. Tell us who you are and we'll reply to schedule it. DPA before any customer PDF.",
    submit: "Request pilot",
  },
};

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "error"; message: string }
  | { state: "mailto" };

const EMPTY = { name: "", email: "", company: "", size: "51–200", role: "", message: "", website: "" };

function composeMessage(form: typeof EMPTY): string {
  const extra = [
    form.role && `Role: ${form.role}`,
    form.size && `Team size: ${form.size}`,
    form.message,
  ].filter(Boolean);
  return extra.join("\n").slice(0, LIMITS.message);
}

export function DemoDialog() {
  const { open, kind, setOpen } = useDemoDialog();
  const [status, setStatus] = React.useState<Status>({ state: "idle" });
  const [form, setForm] = React.useState(EMPTY);
  const copy = COPY[kind];

  React.useEffect(() => {
    if (!open) setStatus({ state: "idle" });
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (CHANNEL === "closed") return;
    if (!form.email || !form.name || !form.company) return;
    const message = composeMessage(form);

    if (CHANNEL === "mailto") {
      const subject = `${kind === "pilot" ? "€149 pilot request" : "Executive demo request"} — ${form.company}`;
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Company: ${form.company}`,
        message,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ state: "mailto" });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch(`${API_URL}/api/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: message || null,
          source: kind,
          website: form.website || null,
        }),
      });
      if (!res.ok) {
        const msg =
          res.status === 429
            ? "Too many requests from your network. Please try again later."
            : res.status === 422
              ? "Some fields look invalid. Check your email address and try again."
              : `We could not save your request (error ${res.status}). Nothing was sent; please try again later.`;
        setStatus({ state: "error", message: msg });
        return;
      }
      setStatus({ state: "idle" });
      setOpen(false);
      toast.success(kind === "pilot" ? "Pilot request saved" : "Demo request saved", {
        description: `We stored your request and will reply to ${form.email}.`,
      });
      setForm(EMPTY);
    } catch {
      setStatus({
        state: "error",
        message: "Network error: your request was not saved. Please try again later.",
      });
    }
  }

  const disabled = CHANNEL === "closed" || status.state === "sending";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
          <form onSubmit={submit} className="p-6 sm:p-7">
            <DialogTitle className="text-xl tracking-tight">{copy.title}</DialogTitle>
            <DialogDescription className="text-sm">{copy.description}</DialogDescription>

            {CHANNEL === "closed" && (
              <p
                role="status"
                className="mt-4 flex items-start gap-2 rounded-md border border-border bg-secondary/50 p-3 text-sm"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Booking is not open yet. This form cannot send requests at the moment.
              </p>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input
                  required
                  maxLength={LIMITS.name}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Work email" required>
                <Input
                  required
                  type="email"
                  maxLength={320}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                />
              </Field>
              <Field label="Company" required>
                <Input
                  required
                  maxLength={LIMITS.company}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                />
              </Field>
              <Field label="Role">
                <Input
                  maxLength={100}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="COO, CIO, Head of Ops…"
                />
              </Field>
              <Field label="Team size">
                <select
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="What would you like to see? (optional)" className="mt-3">
              <Textarea
                rows={3}
                maxLength={1500}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="e.g. grounding a sales playbook for our reps…"
              />
            </Field>

            {/* Honeypot: hidden from people, filled by bots. Backend drops these. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
            </div>

            {status.state === "error" && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {status.message}
              </p>
            )}
            {status.state === "mailto" && (
              <p role="status" className="mt-4 flex items-start gap-2 text-sm">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                Your email app opened with the request filled in. Send it to reach us — nothing
                has been sent yet. If no app opened, write to {SALES_EMAIL}.
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              {leadFormConsent.before}{" "}
              <a href={leadFormConsent.href} className="underline underline-offset-2">
                {leadFormConsent.linkLabel}
              </a>
              {leadFormConsent.after}
            </p>

            <DialogFooter className="mt-5 flex-row items-center justify-between gap-3 sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">
                {CHANNEL === "mailto"
                  ? "Opens your email app; nothing is sent until you send it."
                  : CHANNEL === "api"
                    ? "Stored so we can reply. Details are in the privacy notice."
                    : "Requests are not being accepted yet."}
              </p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  {status.state === "mailto" ? "Close" : "Cancel"}
                </Button>
                <Button type="submit" disabled={disabled}>
                  {CHANNEL === "closed"
                    ? "Booking not open yet"
                    : status.state === "sending"
                      ? "Sending…"
                      : CHANNEL === "mailto"
                        ? "Open email"
                        : copy.submit}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </DialogFooter>
          </form>

          <aside className="border-t border-border bg-secondary/40 p-6 md:border-l md:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              What to expect
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              <Bullet icon={<Clock className="h-4 w-4 text-brand" />}>
                30 minutes · CFO/CIO friendly
              </Bullet>
              <Bullet icon={<ShieldCheck className="h-4 w-4 text-brand" />}>
                DPA before any customer PDF
              </Bullet>
              <Bullet icon={<Globe2 className="h-4 w-4 text-brand" />}>
                No SOC 2 yet. Data stays in your tenant.
              </Bullet>
            </ul>
            <div className="mt-5 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
              14-day paid technical pilot, €149, invoice. DPA before any customer PDF.
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `space-y-1.5 ${className}` : "space-y-1.5"}>
      <Label className="flex items-center gap-1 text-xs">
        {label}
        {required && <span className="text-brand">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Bullet({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <span>{children}</span>
    </li>
  );
}
