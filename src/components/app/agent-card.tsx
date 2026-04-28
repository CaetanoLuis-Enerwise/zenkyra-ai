"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Pause,
  Play,
  Settings2,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/app/charts";
import { CountUp } from "@/components/app/count-up";
import { cn, formatNumber } from "@/lib/utils";
import type { Agent } from "@/lib/mock-data";
import { toast } from "sonner";

const accents: Record<
  Agent["accent"],
  { ring: string; chip: string; glow: string; bar: string }
> = {
  indigo: {
    ring: "ring-brand/30",
    chip: "bg-brand/10 text-brand",
    glow: "from-brand/20",
    bar: "bg-brand",
  },
  emerald: {
    ring: "ring-emerald-500/30",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    glow: "from-emerald-500/20",
    bar: "bg-emerald-500",
  },
  amber: {
    ring: "ring-amber-500/30",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    glow: "from-amber-500/20",
    bar: "bg-amber-500",
  },
  violet: {
    ring: "ring-violet-500/30",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    glow: "from-violet-500/20",
    bar: "bg-violet-500",
  },
  rose: {
    ring: "ring-rose-500/30",
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    glow: "from-rose-500/20",
    bar: "bg-rose-500",
  },
};

interface Props {
  agent: Agent;
  index?: number;
}

export function AgentCard({ agent, index = 0 }: Props) {
  const [status, setStatus] = React.useState<Agent["status"]>(agent.status);
  const a = accents[agent.accent];

  function toggle() {
    if (status === "active") {
      setStatus("draft");
      toast(`${agent.name} paused`, {
        description: "Resume any time. Tasks in flight will complete.",
      });
    } else {
      setStatus("active");
      toast.success(`${agent.name} activated`, {
        description: "Picking up tasks now from your inbox + workflows.",
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "group relative flex h-full flex-col overflow-hidden transition hover:border-brand/30",
          status === "active" && "ring-1",
          status === "active" && a.ring
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br to-transparent blur-2xl opacity-70 transition-opacity group-hover:opacity-100",
            a.glow
          )}
        />

        <div className="relative flex items-start justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 backdrop-blur-sm",
                a.chip
              )}
            >
              <Bot className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">{agent.name}</h3>
              <p className="truncate text-xs text-muted-foreground">
                {agent.tagline}
              </p>
            </div>
          </div>
          <StatusPill status={status} />
        </div>

        <div className="relative grid grid-cols-3 gap-px border-y border-border bg-border/50">
          <Metric
            label="Tasks"
            value={<CountUp value={formatNumber(agent.tasksCompleted)} />}
            sublabel="this month"
          />
          <Metric
            label="Hours saved"
            value={<CountUp value={formatNumber(agent.hoursSaved)} />}
            sublabel={`${agent.uptimeDays}d uptime`}
          />
          <Metric
            label="Accuracy"
            value={<>{agent.accuracy}<span className="text-base text-muted-foreground">%</span></>}
            sublabel={`${agent.workflows} workflows`}
          />
        </div>

        <div className="relative flex flex-col gap-4 p-5">
          <div className="-mx-1 h-12">
            <Sparkline data={agent.spark} trend="up" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Capabilities
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {agent.capabilities.slice(0, 3).map((c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-border bg-card/40 p-4">
          <Button variant="ghost" size="sm">
            <Settings2 className="h-4 w-4" />
            Configure
          </Button>
          <Button
            size="sm"
            variant={status === "active" ? "outline" : "default"}
            onClick={toggle}
            className="group/btn"
          >
            {status === "active" ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : status === "training" ? (
              <>
                <Sparkles className="h-4 w-4" />
                Activate
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Activate
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: React.ReactNode;
  sublabel?: string;
}) {
  return (
    <div className="bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
      {sublabel && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Agent["status"] }) {
  if (status === "active")
    return (
      <Badge variant="success" className="shrink-0">
        <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
        Active
      </Badge>
    );
  if (status === "training")
    return (
      <Badge variant="warning" className="shrink-0">
        <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-warning animate-pulse-slow" />
        Training
      </Badge>
    );
  return (
    <Badge variant="muted" className="shrink-0">
      Paused
    </Badge>
  );
}
