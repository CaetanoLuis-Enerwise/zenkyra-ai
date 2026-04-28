"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

export function FinalCTA() {
  const open = useDemoDialog((s) => s.openDialog);
  return (
    <section className="relative overflow-hidden border-b border-border py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]" />
      <div className="container relative">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-10 text-center shadow-elev">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 mask-fade-b" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Ready when you are
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Hire your digital workforce today.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
              30 minutes with our team and you'll leave with a tailored ROI projection, a security pack and a clear path to your first agent on shift in 7 days. No procurement nightmare. No data leaving your tenant.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="xl" onClick={() => open("final-cta")}>
                <CalendarCheck className="h-4 w-4" />
                Book Executive Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/onboarding">Start free pilot</Link>
              </Button>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              SOC 2 Type II · ISO 27001 · GDPR · HIPAA-ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
