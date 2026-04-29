"use client";

import { motion } from "framer-motion";
import { howItWorks } from "@/lib/mock-data";

export function HowItWorks() {
  return (
    <section className="section-marketing border-border">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="marketing-eyebrow">How it works</p>
          <h2 className="marketing-headline">
            From signed NDA to a working digital teammate — in three steps.
          </h2>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {howItWorks.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="relative text-center md:text-left"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card font-mono text-sm font-medium tracking-tight shadow-elev md:mx-0">
                <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
