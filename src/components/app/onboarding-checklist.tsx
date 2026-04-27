"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  CloudUpload,
  Sparkles,
  UserPlus,
  Workflow,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "zenkyra:onboarding";

interface Item {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  defaultDone?: boolean;
}

const ITEMS: Item[] = [
  {
    id: "upload",
    title: "Upload your first 5 documents",
    description: "Indexed in under 60 seconds.",
    href: "/knowledge",
    icon: <CloudUpload className="h-4 w-4" />,
    defaultDone: true,
  },
  {
    id: "ask",
    title: "Ask Zenkyra your first question",
    description: "Try “Summarize our Q1 sales playbook”.",
    href: "/assistant",
    icon: <Sparkles className="h-4 w-4" />,
    defaultDone: true,
  },
  {
    id: "automation",
    title: "Activate an automation template",
    description: "Lead Response Agent · 12-min setup.",
    href: "/automations",
    icon: <Workflow className="h-4 w-4" />,
  },
  {
    id: "invite",
    title: "Invite 2 teammates",
    description: "Sales + Support champions unlock 3× ROI.",
    href: "/team",
    icon: <UserPlus className="h-4 w-4" />,
  },
];

export function OnboardingChecklist() {
  const [done, setDone] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(ITEMS.map((i) => [i.id, !!i.defaultDone]))
  );
  const [dismissed, setDismissed] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { done?: typeof done; dismissed?: boolean };
      if (parsed.done) setDone((prev) => ({ ...prev, ...parsed.done }));
      if (parsed.dismissed) setDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ done, dismissed }));
    } catch {
      /* ignore */
    }
  }, [done, dismissed, hydrated]);

  const completed = Object.values(done).filter(Boolean).length;
  const total = ITEMS.length;
  const pct = Math.round((completed / total) * 100);

  if (dismissed || completed === total) return null;

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Get started
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {completed} of {total} complete
                </span>
              </div>
              <h3 className="mt-1 text-base font-semibold">
                Finish setup in 4 quick steps
              </h3>
              <Progress value={pct} className="mt-3 max-w-xs" />
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Dismiss onboarding checklist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="relative grid grid-cols-1 gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
            {ITEMS.map((item) => {
              const isDone = !!done[item.id];
              return (
                <li
                  key={item.id}
                  className={cn(
                    "group flex items-start gap-3 bg-card p-4 transition-colors",
                    isDone && "opacity-70"
                  )}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    aria-label={isDone ? "Mark as not done" : "Mark as done"}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                      isDone
                        ? "border-success bg-success text-white"
                        : "border-border hover:border-brand/40"
                    )}
                  >
                    {isDone && <Check className="h-3 w-3" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-brand">{item.icon}</span>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isDone && "line-through text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    {!isDone && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="-ml-2 mt-1 h-7 px-2 text-xs text-brand hover:text-brand"
                      >
                        <Link href={item.href}>
                          Continue
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
