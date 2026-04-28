import {
  ArrowRight,
  Bot,
  Briefcase,
  CircleDollarSign,
  Clock,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/app/stat-card";
import { ChartCard } from "@/components/app/chart-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageAreaChart, AdoptionBarChart } from "@/components/app/charts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OnboardingChecklist } from "@/components/app/onboarding-checklist";
import { initials } from "@/lib/utils";
import { api } from "@/lib/api";

const STAT_ICONS = [
  <Briefcase key="b" className="h-4 w-4" />,
  <Clock key="c" className="h-4 w-4" />,
  <CircleDollarSign key="d" className="h-4 w-4" />,
  <TrendingUp key="t" className="h-4 w-4" />,
];

export default async function OverviewPage() {
  const data = await api.overview();

  return (
    <div className="space-y-6">
      <Hero />

      <OnboardingChecklist />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            trend={s.trend}
            hint={s.hint}
            icon={STAT_ICONS[i]}
            spark={s.spark}
            index={i}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Active workforce</h3>
              <p className="text-sm text-muted-foreground">
                Live across {data.agents.length} agents · {data.agents.filter((a) => a.status === "active").length} on shift
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/agents">
                Manage agents
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data.agents.map((a) => (
              <li
                key={a.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card/40 p-3 transition hover:border-brand/30"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <AgentDot status={a.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {a.tasksCompleted.toLocaleString()} tasks · {a.hoursSaved} hrs saved
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand/15 blur-3xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Workforce ROI
          </p>
          <p className="relative mt-2 text-3xl font-semibold tabular-nums">
            {data.monthlySaved.value}
          </p>
          <p className="relative text-xs text-muted-foreground">
            Estimated cost saved by your Zenkyra workforce this month
          </p>
          <div className="relative mt-3 flex items-center gap-2">
            <Badge variant="success">{data.monthlySaved.deltaPct}</Badge>
            <span className="text-xs text-muted-foreground">vs March</span>
          </div>
          <Button variant="outline" size="sm" className="relative mt-5 w-full" asChild>
            <Link href="/analytics">
              Open ROI dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Workforce activity — last 30 days"
          description="Tasks completed and workflows triggered"
          className="xl:col-span-2"
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" /> Tasks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-300" /> Workflows
              </span>
            </div>
          }
        >
          <UsageAreaChart data={data.usage} />
        </ChartCard>

        <ChartCard title="Department adoption" description="Active users per department">
          <AdoptionBarChart data={data.adoption} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Live agent activity</h3>
              <p className="text-sm text-muted-foreground">
                Every action your workforce took recently
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {data.activity.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-brand/15 text-brand text-[11px]">
                    {initials(item.agent)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <Badge variant="muted" className="hidden text-[10px] sm:inline-flex">
                        {item.agent}
                      </Badge>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold">Quick actions</h3>
          <p className="text-sm text-muted-foreground">Most-used commands</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <QuickAction icon={<Bot className="h-4 w-4" />} label="Hire agent" href="/agents" highlight />
            <QuickAction icon={<Plus className="h-4 w-4" />} label="New workflow" href="/workflows" />
            <QuickAction icon={<TrendingUp className="h-4 w-4" />} label="View ROI" href="/analytics" />
            <QuickAction icon={<Clock className="h-4 w-4" />} label="Audit log" href="/security" />
          </div>

          <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              This month
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {data.monthlySaved.value}
            </p>
            <p className="text-xs text-muted-foreground">
              estimated cost saved by Zenkyra AI
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="success">{data.monthlySaved.deltaPct}</Badge>
              <span className="text-xs text-muted-foreground">vs March</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge variant="default" className="rounded-md px-2 py-0.5">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
            Workforce online · 4 of 5 agents on shift
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Your digital workforce is active.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            Five Zenkyra agents are working for Acme right now — qualifying leads, resolving tickets, processing invoices and drafting executive briefings. Here's what they shipped today.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              All agents healthy
            </span>
            <span aria-hidden>·</span>
            <span>Last sync 2 min ago</span>
            <span aria-hidden>·</span>
            <span>3 new approvals waiting</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/agents">
              <Bot className="h-4 w-4" />
              Manage agents
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analytics">View ROI</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AgentDot({ status }: { status: "active" | "training" | "draft" }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
        Active
      </span>
    );
  if (status === "training")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-warning">
        <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse-slow" />
        Training
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      Paused
    </span>
  );
}

function QuickAction({
  icon,
  label,
  href,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        highlight
          ? "group flex flex-col items-start gap-2 rounded-lg border border-brand/30 bg-brand/10 p-3 transition hover:bg-brand/15"
          : "group flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-3 transition hover:border-brand/40 hover:bg-accent"
      }
    >
      <span
        className={
          highlight
            ? "flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white"
            : "flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground"
        }
      >
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
