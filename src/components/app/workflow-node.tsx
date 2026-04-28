"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WorkflowNodeProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone?: "brand" | "success" | "warning" | "muted";
  /** Highlight as the agent step (the brain of the workflow). */
  accent?: boolean;
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
  accent = false,
  index = 0,
}: WorkflowNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className={cn(
        "relative flex w-[210px] shrink-0 items-center gap-3 rounded-xl border bg-card p-3.5 shadow-elev transition hover:border-brand/30",
        accent
          ? "border-brand/30 ring-1 ring-brand/20"
          : "border-border"
      )}
    >
      {accent && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-brand/10 via-transparent to-transparent"
        />
      )}
      <span
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border [&_svg]:h-5 [&_svg]:w-5",
          tones[tone]
        )}
      >
        {icon}
      </span>
      <div className="relative min-w-0">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {accent && (
        <span
          aria-hidden
          className="absolute -right-1.5 -top-1.5 flex h-3 w-3 items-center justify-center"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
          <span className="relative h-2 w-2 rounded-full bg-brand" />
        </span>
      )}
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
