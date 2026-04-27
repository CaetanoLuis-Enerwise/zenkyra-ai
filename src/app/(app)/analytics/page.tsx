import {
  TrendingUp,
  Wallet,
  Gauge,
  Clock,
  Users,
  Download,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/app/stat-card";
import { ChartCard } from "@/components/app/chart-card";
import { Button } from "@/components/ui/button";
import {
  RoiAreaChart,
  HorizontalBarChart,
  DepartmentDonut,
} from "@/components/app/charts";
import { api } from "@/lib/api";

const KPI_ICONS = [
  <Wallet key="w" className="h-4 w-4" />,
  <Gauge key="g" className="h-4 w-4" />,
  <Clock key="c" className="h-4 w-4" />,
  <Users key="u" className="h-4 w-4" />,
];

export default async function AnalyticsPage() {
  const data = await api.analytics();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive view"
        title="Analytics"
        description="How Zenkyra AI is impacting your business — across every department."
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
              Export report
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
          title="ROI over time"
          description="Cost saved vs platform investment"
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

        <ChartCard title="Usage by department" description="Share of total queries">
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

      <section>
        <ChartCard title="Top automations" description="Hours saved this month">
          <HorizontalBarChart data={data.topAutomations} />
        </ChartCard>
      </section>
    </div>
  );
}
