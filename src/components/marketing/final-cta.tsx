"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

export function FinalCTA() {
  const open = useDemoDialog((s) => s.openDialog);
  return (
    <section className="relative overflow-hidden section-marketing border-border">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 animate-ambient rounded-full bg-brand/18 blur-[110px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-card via-card to-secondary/50 p-10 text-center shadow-elev sm:p-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] mask-fade-b dark:opacity-[0.2]" />

          <div className="relative flex flex-col items-center gap-4">
            <Badge
              variant="secondary"
              className="gap-2 border border-brand/25 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand"
            >
              <Clock className="h-3.5 w-3.5" />
              Limited quarterly onboarding cohort · advisory slots fill first
            </Badge>

            <p className="marketing-eyebrow mt-2">Decision window</p>

            <h2 className="marketing-headline">
              Hire your digital workforce — advisory cohort closes quarterly.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Thirty minutes — tailored ROI projection, security packet walk-through,
              and a deployment path that lands your first agent on shift inside seven days.
              Most pilots provision within forty-eight hours of the call.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button size="xl" onClick={() => open("final-cta")} className="gap-2 shadow-lg shadow-brand/20">
                <CalendarCheck className="h-4 w-4" />
                Book Executive Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/onboarding">Start free pilot</Link>
              </Button>
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                SOC 2 Type II · ISO 27001 · GDPR · HIPAA-ready
              </span>
              <span className="hidden h-4 w-px bg-border sm:inline-block" aria-hidden />
              <span className="font-medium text-foreground/90">
                Reply typically within one business day · EU-resident tenants
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
