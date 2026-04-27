"use client";

import * as React from "react";
import { create } from "zustand";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Globe2,
  Lock,
  ShieldCheck,
} from "lucide-react";
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

interface DemoState {
  open: boolean;
  source?: string;
  openDialog: (source?: string) => void;
  setOpen: (v: boolean) => void;
}

export const useDemoDialog = create<DemoState>((set) => ({
  open: false,
  source: undefined,
  openDialog: (source) => set({ open: true, source }),
  setOpen: (v) => set({ open: v }),
}));

const SLOTS = [
  "Tomorrow · 09:00",
  "Tomorrow · 14:30",
  "Wed · 11:00",
  "Wed · 16:00",
  "Thu · 10:30",
  "Fri · 15:00",
];

const SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

export function DemoDialog() {
  const { open, source, setOpen } = useDemoDialog();
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    company: "",
    size: "51–200",
    role: "",
    message: "",
    slot: SLOTS[0],
  });

  React.useEffect(() => {
    if (!open) {
      setSubmitting(false);
    }
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.name || !form.company) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setOpen(false);
    toast.success("Demo request received", {
      description: `We'll confirm ${form.slot} (CET) on ${form.email} within the hour.`,
    });
    setForm((p) => ({ ...p, message: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
          <form onSubmit={submit} className="p-6 sm:p-7">
            <DialogTitle className="text-xl tracking-tight">
              Book a 30-min private demo
            </DialogTitle>
            <DialogDescription className="text-sm">
              See Zenkyra run on a tenant just like yours. We tailor the agenda to your team's playbook.
            </DialogDescription>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Helena Schmidt"
                />
              </Field>
              <Field label="Work email" required>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="helena@northwind.com"
                />
              </Field>
              <Field label="Company" required>
                <Input
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Northwind"
                />
              </Field>
              <Field label="Role">
                <Input
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
              <Field label="Preferred slot">
                <select
                  value={form.slot}
                  onChange={(e) => setForm({ ...form, slot: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {SLOTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="What would you like to see? (optional)" className="mt-3">
              <Textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="e.g. Our use case is grounding a sales playbook for 80 reps in EMEA…"
              />
            </Field>

            <DialogFooter className="mt-5 flex-row items-center justify-between gap-3 sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">
                {source ? `Sent from ${source}.` : "Sent to your CSM team in Lisbon."}
              </p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Confirm slot"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </DialogFooter>
          </form>

          <aside className="border-t border-border bg-secondary/40 p-6 md:border-l md:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              What you’ll get
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              <Bullet icon={<Clock className="h-4 w-4 text-brand" />}>
                30 minutes, tailored to your stack
              </Bullet>
              <Bullet icon={<Calendar className="h-4 w-4 text-brand" />}>
                Confirmation within the hour
              </Bullet>
              <Bullet icon={<CheckCircle2 className="h-4 w-4 text-brand" />}>
                Live ROI estimate for your team
              </Bullet>
              <Bullet icon={<ShieldCheck className="h-4 w-4 text-brand" />}>
                Trust report &amp; sample DPA shared
              </Bullet>
              <Bullet icon={<Globe2 className="h-4 w-4 text-brand" />}>
                EU-resident · SOC 2 Type II
              </Bullet>
              <Bullet icon={<Lock className="h-4 w-4 text-brand" />}>
                NDA available before the call
              </Bullet>
            </ul>
            <div className="mt-5 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
              Most companies book a pilot within 48 hours of the demo. No procurement needed for pilot — paid plans only after value is proven.
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
      <span>{children}</span>
    </li>
  );
}
