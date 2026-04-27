import {
  Clock,
  MessageSquare,
  FileStack,
  Workflow,
  Sparkles,
  Upload,
  Plus,
  UserPlus,
  ArrowRight,
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
  <Clock key="c" className="h-4 w-4" />,
  <MessageSquare key="m" className="h-4 w-4" />,
  <FileStack key="f" className="h-4 w-4" />,
  <Workflow key="w" className="h-4 w-4" />,
];

export default async function DashboardPage() {
  const data = await api.dashboard();

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
        <ChartCard
          title="Usage — last 30 days"
          description="Queries answered and automations triggered"
          className="xl:col-span-2"
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" /> Queries
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-300" /> Automations
              </span>
            </div>
          }
        >
          <UsageAreaChart data={data.usage} />
        </ChartCard>

        <ChartCard title="Department adoption" description="Active users by department">
          <AdoptionBarChart data={data.adoption} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Recent activity</h3>
              <p className="text-sm text-muted-foreground">
                Live across your AI agents and team
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
                    {initials(item.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{item.title}</p>
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
            <QuickAction icon={<Sparkles className="h-4 w-4" />} label="Ask AI" href="/assistant" highlight />
            <QuickAction icon={<Upload className="h-4 w-4" />} label="Upload Docs" href="/knowledge" />
            <QuickAction icon={<Plus className="h-4 w-4" />} label="Create Workflow" href="/workflows" />
            <QuickAction icon={<UserPlus className="h-4 w-4" />} label="Invite Team" href="/team" />
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
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-brand animate-pulse-slow" />
            System active · eu-central-1
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Good afternoon, Sofia.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            Acme’s private intelligence system is humming — 142 teammates, 8,402 documents indexed, 27 automations live. Here’s what changed since you last looked.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              All systems operational
            </span>
            <span aria-hidden>·</span>
            <span>Last sync 2 min ago</span>
            <span aria-hidden>·</span>
            <span>3 new alerts in audit log</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/assistant">
              <Sparkles className="h-4 w-4" />
              Ask Zenkyra
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analytics">View analytics</Link>
          </Button>
        </div>
      </div>
    </div>
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
