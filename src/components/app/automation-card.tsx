"use client";

import * as React from "react";
import {
  ArrowRight,
  Bot,
  Clock,
  MoreHorizontal,
  Pause,
  Play,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkline } from "@/components/app/charts";
import { formatNumber } from "@/lib/utils";
import type { Automation } from "@/lib/mock-data";

interface AutomationCardProps {
  a: Automation;
  index?: number;
}

export function AutomationCard({ a, index = 0 }: AutomationCardProps) {
  const [status, setStatus] = React.useState<Automation["status"]>(a.status);

  // Deterministic-looking sparkline derived from id
  const seed = a.id.charCodeAt(a.id.length - 1) || 7;
  const spark = Array.from({ length: 14 }).map((_, i) =>
    Math.round(20 + Math.sin(i / 1.6 + seed) * 8 + i * 1.4)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden transition hover:border-brand/30">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/5 blur-2xl transition group-hover:bg-brand/10" />

        <div className="flex items-start justify-between gap-2 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold">{a.name}</h3>
              <p className="text-xs text-muted-foreground">{a.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StatusPill status={status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Automation actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setStatus(status === "active" ? "paused" : "active")}
                >
                  {status === "active" ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>View runs</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="px-5 text-sm text-muted-foreground">{a.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 px-5 text-sm">
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="text-xs text-muted-foreground">Runs this month</p>
            <p className="mt-0.5 text-lg font-semibold">{formatNumber(a.runs)}</p>
            <div className="mt-1 h-7 -mx-1">
              <Sparkline data={spark} trend="up" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Time saved
            </p>
            <p className="mt-0.5 text-lg font-semibold">
              {a.hoursSaved}
              <span className="text-sm font-medium text-muted-foreground"> hrs</span>
            </p>
            <div className="mt-1 flex items-end gap-0.5 h-7">
              {spark.map((v, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-brand/40"
                  style={{ height: `${Math.min(100, (v / 35) * 100)}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border bg-card/40 p-4">
          <Button variant="ghost" size="sm">
            <WorkflowIcon className="h-4 w-4" />
            Logs
          </Button>
          <Button variant="ghost" size="sm" className="text-brand hover:text-brand">
            Configure
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function StatusPill({ status }: { status: Automation["status"] }) {
  if (status === "active")
    return (
      <Badge variant="success">
        <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
        Active
      </Badge>
    );
  if (status === "paused") return <Badge variant="warning">Paused</Badge>;
  return <Badge variant="muted">Draft</Badge>;
}
