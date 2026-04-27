"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts";
import type { Trend } from "@/lib/mock-data";

const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

interface PremiumTooltipPayloadItem {
  name?: string;
  dataKey?: string;
  value?: number;
  color?: string;
}

interface PremiumTooltipProps {
  active?: boolean;
  payload?: PremiumTooltipPayloadItem[];
  label?: string | number;
  labels?: Record<string, string>;
  formatValue?: (value: number, dataKey?: string) => string;
  unit?: string;
}

function PremiumTooltip({
  active,
  payload,
  label,
  labels,
  formatValue,
  unit,
}: PremiumTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-elev backdrop-blur">
      {label !== undefined && (
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => {
          const name = labels?.[p.dataKey ?? p.name ?? ""] ?? p.name ?? p.dataKey;
          const v = typeof p.value === "number" ? p.value : 0;
          const display = formatValue ? formatValue(v, p.dataKey) : `${v.toLocaleString()}${unit ?? ""}`;
          return (
            <div key={i} className="flex items-center gap-3">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="flex-1 text-muted-foreground">{name}</span>
              <span className="font-medium tabular-nums">{display}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface UsageDatum {
  day: string;
  queries: number;
  automations: number;
}

export function UsageAreaChart({ data }: { data: UsageDatum[] }) {
  const avg = data.reduce((acc, d) => acc + d.queries, 0) / data.length;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, left: -16, right: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="qFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F7DFF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#4F7DFF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94B0FF" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#94B0FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="day" {...axisProps} interval={3} />
        <YAxis {...axisProps} />
        <ReferenceLine
          y={avg}
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="2 4"
          opacity={0.4}
          label={{
            value: `avg ${Math.round(avg).toLocaleString()}`,
            position: "right",
            fill: "hsl(var(--muted-foreground))",
            fontSize: 10,
          }}
        />
        <Tooltip
          content={
            <PremiumTooltip
              labels={{ queries: "Queries", automations: "Automation runs" }}
            />
          }
          cursor={{ stroke: "hsl(var(--border))", strokeDasharray: 4 }}
        />
        <Area
          type="monotone"
          dataKey="queries"
          stroke="#4F7DFF"
          strokeWidth={2}
          fill="url(#qFill)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="automations"
          stroke="#94B0FF"
          strokeWidth={2}
          fill="url(#aFill)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AdoptionBarChart({
  data,
}: {
  data: { department: string; adoption: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, left: -16, right: 8, bottom: 0 }}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="department" {...axisProps} />
        <YAxis {...axisProps} unit="%" />
        <Tooltip
          content={
            <PremiumTooltip
              labels={{ adoption: "Adoption" }}
              formatValue={(v) => `${v}%`}
            />
          }
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.4 }}
        />
        <Bar dataKey="adoption" radius={[8, 8, 0, 0]} fill="#4F7DFF">
          {data.map((entry, i) => (
            <Cell key={i} fill={i === 0 ? "#4F7DFF" : "#6F94FF"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RoiAreaChart({
  data,
}: {
  data: { month: string; saved: number; invested: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, left: -10, right: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="rFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F7DFF" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#4F7DFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => `€${v / 1000}k`} />
        <Tooltip
          content={
            <PremiumTooltip
              labels={{ saved: "Cost saved", invested: "Invested" }}
              formatValue={(v) => `€${v.toLocaleString()}`}
            />
          }
          cursor={{ stroke: "hsl(var(--border))", strokeDasharray: 4 }}
        />
        <Area
          type="monotone"
          dataKey="saved"
          stroke="#4F7DFF"
          strokeWidth={2.2}
          fill="url(#rFill)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="invested"
          stroke="#94B0FF"
          strokeDasharray="4 4"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBarChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 6, left: 8, right: 16, bottom: 0 }}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" horizontal={false} />
        <XAxis type="number" {...axisProps} />
        <YAxis dataKey="name" type="category" {...axisProps} width={110} />
        <Tooltip
          content={<PremiumTooltip labels={{ value: "Hours saved" }} unit=" hrs" />}
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.4 }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#4F7DFF" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({
  data,
  trend = "up",
}: {
  data: number[];
  trend?: Trend;
}) {
  const series = data.map((v, i) => ({ i, v }));
  const stroke =
    trend === "down" ? "#22c55e" : trend === "flat" ? "#94B0FF" : "#4F7DFF";
  const id = React.useId().replace(/:/g, "");
  const fillId = `sparkFill-${id}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={series} margin={{ top: 4, left: 4, right: 4, bottom: 0 }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.45} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={1.75}
          fill={`url(#${fillId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = ["#4F7DFF", "#6F94FF", "#94B0FF", "#BACDFF", "#DCE7FF", "#2F5FE6"];

export function DepartmentDonut({
  data,
}: {
  data: { department: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="department"
          innerRadius={60}
          outerRadius={92}
          paddingAngle={2}
          stroke="hsl(var(--background))"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={
            <PremiumTooltip
              labels={{ value: "Share" }}
              formatValue={(v) => `${v}%`}
            />
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
