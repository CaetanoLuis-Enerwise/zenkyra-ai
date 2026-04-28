import {
  Calendar,
  Clock,
  Download,
  Gauge,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/app/stat-card";
import { ChartCard } from "@/components/app/chart-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RoiAreaChart,
  HorizontalBarChart,
  DepartmentDonut,
} from "@/components/app/charts";
import { formatNumber } from "@/lib/utils";
import { api } from "@/lib/api";

const KPI_ICONS = [
  <Wallet key="w" className="h-4 w-4" />,
  <Clock key="c" className="h-4 w-4" />,
  <Gauge key="g" className="h-4 w-4" />,
  <Users key="u" className="h-4 w-4" />,
];

export default async function AnalyticsPage() {
  const data = await api.analytics();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ROI dashboard for executives"
        title="Analytics"
        description="The financial impact of your digital workforce — money saved, hours reclaimed, department efficiency and per-agent performance."
        meta={
          <>
            <span>Updated 2 minutes ago</span>
            <span className="hidden md:inline">·</span>
            <span>Source: Zenkyra Insights</span>
            <span className="hidden md:inline">·</span>
            <span>EU · Frankfurt</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" />
              Last 90 days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export board pack
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((k, i) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            trend={k.trend}
            hint={k.hint}
            icon={KPI_ICONS[i]}
            spark={k.spark}
            index={i}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Money saved over time"
          description="Cumulative cost savings vs platform investment"
          className="xl:col-span-2"
          action={
            <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
              <TrendingUp className="h-3 w-3" />
              7.4× ROI
            </span>
          }
        >
          <RoiAreaChart data={data.roi} />
        </ChartCard>

        <ChartCard title="Department efficiency" description="Share of work handled by agents">
          <DepartmentDonut data={data.byDept} />
          <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {data.byDept.map((d, i) => (
              <li key={d.department} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      ["#4F7DFF", "#6F94FF", "#94B0FF", "#BACDFF", "#DCE7FF", "#2F5FE6"][
                        i % 6
                      ],
                  }}
                />
                <span className="flex-1 truncate text-muted-foreground">{d.department}</span>
                <span className="font-medium">{d.value}%</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Agent performance"
          description="Hours saved per agent this month"
          className="xl:col-span-2"
          action={
            <Badge variant="muted" className="text-[10px]">
              {formatNumber(
                data.agentPerformance.reduce((acc, x) => acc + x.value, 0)
              )} hrs total
            </Badge>
          }
        >
          <HorizontalBarChart data={data.agentPerformance} />
        </ChartCard>

        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Quarterly board summary
          </p>
          <h3 className="relative mt-2 text-lg font-semibold tracking-tight">
            Your workforce at a glance.
          </h3>
          <ul className="relative mt-4 space-y-3 text-sm">
            <SummaryRow label="Money saved (annualized)" value="€1.84M" delta="+32%" />
            <SummaryRow label="Hours reclaimed" value="42,180 hrs" delta="+18%" />
            <SummaryRow label="Avg. agent uptime" value="99.94%" delta="+0.18pts" />
            <SummaryRow label="Median tasks / agent / day" value="612" delta="+24%" />
          </ul>
          <p className="relative mt-5 text-xs text-muted-foreground">
            Export the full pack with reproducible methodology, audit trail and per-team breakdowns — formatted for finance and the board.
          </p>
          <Button className="relative mt-4 w-full" variant="outline">
            <Download className="h-4 w-4" />
            Export board pack
          </Button>
        </Card>
      </section>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-semibold tabular-nums">{value}</span>
        <Badge variant="success" className="h-5 px-1.5 text-[10px]">
          {delta}
        </Badge>
      </span>
    </li>
  );
}
