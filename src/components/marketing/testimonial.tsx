"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { testimonials } from "@/lib/mock-data";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Testimonial() {
  return (
    <section className="section-marketing relative overflow-hidden border-border bg-gradient-to-b from-secondary/40 via-background to-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-24 h-72 w-72 rounded-full bg-brand/10 blur-[100px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="marketing-eyebrow">Executive voices</p>
          <h2 className="marketing-headline">
            Proof from the buying committee — not marketing fluff.
          </h2>
          <p className="marketing-sub">
            Placeholder quotes styled like verified references; swap with signed
            customer releases when your pipeline closes.
          </p>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {testimonials.map((t) => (
            <motion.li key={t.author} variants={item}>
              <Card className="group relative flex h-full flex-col overflow-hidden border bg-card/90 p-7 shadow-sm ring-1 ring-border/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/5">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-3">
                  <Quote className="h-7 w-7 shrink-0 text-brand/35 transition-colors group-hover:text-brand/50" />
                  <Badge
                    variant="secondary"
                    className="border border-border bg-secondary/80 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  >
                    {t.badge}
                  </Badge>
                </div>
                <blockquote className="relative mt-5 flex-1 text-[15px] leading-relaxed text-foreground/95">
                  “{t.quote}”
                </blockquote>
                <div className="relative mt-6 rounded-xl border border-border/80 bg-secondary/40 px-4 py-3">
                  <p className="text-xs font-semibold tracking-tight text-brand tabular-nums">
                    {t.metric}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Reported outcome · representative deployment
                  </p>
                </div>
                <div className="relative mt-6 flex items-center gap-3 border-t border-border pt-6">
                  <Avatar className="h-11 w-11 ring-2 ring-background">
                    <AvatarFallback className="bg-brand/15 text-sm font-semibold text-brand">
                      {initials(t.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-semibold leading-tight">
                      {t.author}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.role}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground/90">
                      {t.company}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
