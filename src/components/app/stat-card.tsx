"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Trend } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/app/charts";
import { CountUp } from "@/components/app/count-up";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: Trend;
  icon?: React.ReactNode;
  hint?: string;
  spark?: number[];
  index?: number;
}

export function StatCard({
  label,
  value,
  delta,
  trend = "flat",
  icon,
  hint,
  spark,
  index = 0,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    trend === "up"
      ? "text-success bg-success/10"
      : trend === "down"
        ? "text-destructive bg-destructive/10"
        : "text-muted-foreground bg-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden p-5 transition-colors hover:border-brand/30">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              <CountUp value={value} />
            </p>
          </div>
          {icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              {icon}
            </span>
          )}
        </div>

        {spark && spark.length > 1 && (
          <div className="mt-3 -mx-1 h-12 opacity-90 transition-opacity group-hover:opacity-100">
            <Sparkline data={spark} trend={trend} />
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                trendColor
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {delta}
            </span>
          )}
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>

        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/5 blur-2xl transition-colors group-hover:bg-brand/10" />
      </Card>
    </motion.div>
  );
}
