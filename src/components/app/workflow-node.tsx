"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WorkflowNodeProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone?: "brand" | "success" | "warning" | "muted";
  index?: number;
}

const tones = {
  brand: "bg-brand/10 text-brand border-brand/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  muted: "bg-secondary text-foreground border-border",
};

export function WorkflowNode({
  icon,
  title,
  subtitle,
  tone = "brand",
  index = 0,
}: WorkflowNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className="flex w-full max-w-[280px] items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-elev transition hover:border-brand/30"
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:h-5 [&_svg]:w-5",
          tones[tone]
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function WorkflowConnector() {
  return (
    <div className="relative flex h-12 w-10 shrink-0 items-center justify-center">
      <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-border via-brand/40 to-border" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-brand" />
    </div>
  );
}
