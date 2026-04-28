import {
  ArrowRight,
  Bot,
  Briefcase,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from "@/components/app/agent-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatNumber } from "@/lib/utils";
import { api } from "@/lib/api";

export default async function AgentsPage() {
  const data = await api.overview();
  const agents = data.agents;

  const active = agents.filter((a) => a.status === "active").length;
  const totalTasks = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const totalHours = agents.reduce((acc, a) => acc + a.hoursSaved, 0);
  const avgAcc =
    Math.round(
      agents.reduce((acc, a) => acc + a.accuracy, 0) / agents.length
    );

  // Top contributor for the leaderboard.
  const ranking = [...agents].sort((a, b) => b.hoursSaved - a.hoursSaved);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your digital workforce"
        title="Agents"
        description="Hire autonomous AI agents that perform real business work — grounded on your knowledge, acting inside your tools, audited end-to-end."
        meta={
          <>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              {active} of {agents.length} agents on shift
            </span>
            <span className="hidden md:inline">·</span>
            <span>{formatNumber(totalTasks)} tasks completed this month</span>
            <span className="hidden md:inline">·</span>
            <span>{formatNumber(totalHours)} hrs saved · {avgAcc}% avg accuracy</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4" />
              Browse marketplace
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Hire custom agent
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a, i) => (
          <AgentCard key={a.id} agent={a} index={i} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Workforce leaderboard</h3>
              <p className="text-sm text-muted-foreground">
                Hours saved this month, ranked by agent
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/analytics">
                View analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-4 divide-y divide-border">
            {ranking.map((a, i) => {
              const max = ranking[0].hoursSaved;
              const pct = Math.max(8, Math.round((a.hoursSaved / max) * 100));
              return (
                <li key={a.id} className="flex items-center gap-4 py-3">
                  <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-brand/15 text-brand">
                      {initials(a.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">{a.name}</p>
                      <span className="shrink-0 font-mono text-sm tabular-nums">
                        {formatNumber(a.hoursSaved)} <span className="text-xs text-muted-foreground">hrs</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand to-brand-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold">Hire a custom agent</h3>
              <p className="text-xs text-muted-foreground">
                We co-design with you in 7 days
              </p>
            </div>
          </div>
          <p className="relative mt-4 text-sm text-muted-foreground">
            Need an agent for a specific job? Procurement, partner ops, legal review — we ship a tailored, governed agent in your tenant within a week.
          </p>
          <ul className="relative mt-4 space-y-2 text-sm">
            <Bullet>Trained on your private knowledge</Bullet>
            <Bullet>Plugged into your CRM, ERP, helpdesk</Bullet>
            <Bullet>SOC 2 audited · approval rules · BYO LLM</Bullet>
          </ul>
          <Button className="relative mt-5 w-full">
            <Briefcase className="h-4 w-4" />
            Talk to a solutions engineer
          </Button>
          <Badge variant="muted" className="relative mt-3 w-full justify-center">
            Avg. agent live in 7 days · pilot in 24h
          </Badge>
        </Card>
      </section>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-muted-foreground">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
      <span>{children}</span>
    </li>
  );
}
