"use client";

import * as React from "react";
import { ArrowRight, Plus, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const openDemo = useDemoDialog((s) => s.openDialog);

  return (
    <section className="section-marketing border-border">
      <div className="container">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div>
            <p className="marketing-eyebrow">Frequently asked</p>
            <h2 className="marketing-headline">
              Everything Security &amp; Procurement asks first.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-[15px]">
              Our trust report covers everything in detail. If a question is
              missing, ask it on your demo — we'll send a written answer the
              same day.
            </p>

            <div className="mt-7 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Need the full Trust Pack now?
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                SOC 2, ISO 27001, sample DPA, pen-test summary, sub-processor
                list — all in one PDF.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => openDemo("faq-trust")}>
                  Request Trust Pack
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href="/security">Read security overview</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.q}
                  className={cn(
                    "overflow-hidden rounded-xl border bg-card transition-colors",
                    isOpen ? "border-brand/30" : "border-border"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium"
                  >
                    {f.q}
                    <Plus
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-45 text-brand"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
