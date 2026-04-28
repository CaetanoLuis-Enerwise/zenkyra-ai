/**
 * Thin async data layer.
 *
 * Today these helpers wrap the in-memory mock data with a simulated
 * latency so the UI behaves like a real product (Suspense + loading.tsx
 * skeletons fire). Tomorrow you swap the body of any helper for a
 * `fetch`, tRPC call or Server Action — the call sites stay identical.
 */

import {
  agents,
  agentPerformanceData,
  auditEvents,
  automations,
  chatThreads,
  companies,
  departmentAdoption,
  faqs,
  howItWorks,
  knowledgeFiles,
  notifications,
  overviewStats,
  promptSuggestions,
  recentActivity,
  roiData,
  teamMembers,
  testimonials,
  usageByDept,
  usageData,
  type ActivityItem,
  type Agent,
  type Automation,
  type ChatThread,
  type KnowledgeFile,
  type Stat,
  type TeamMember,
} from "@/lib/mock-data";

const SIMULATED_LATENCY = process.env.NODE_ENV === "production" ? 0 : 60;

function withLatency<T>(value: T, ms: number = SIMULATED_LATENCY): Promise<T> {
  if (ms <= 0) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface OverviewData {
  stats: Stat[];
  usage: typeof usageData;
  adoption: typeof departmentAdoption;
  activity: ActivityItem[];
  agents: Agent[];
  monthlySaved: { value: string; deltaPct: string };
}

export interface AnalyticsData {
  kpis: {
    label: string;
    value: string;
    delta: string;
    trend: "up" | "down" | "flat";
    hint: string;
    spark: number[];
  }[];
  roi: typeof roiData;
  byDept: typeof usageByDept;
  agentPerformance: typeof agentPerformanceData;
  agents: Agent[];
}

export const api = {
  overview: async (): Promise<OverviewData> =>
    withLatency({
      stats: overviewStats,
      usage: usageData,
      adoption: departmentAdoption,
      activity: recentActivity,
      agents,
      monthlySaved: { value: "€384,210", deltaPct: "+24% MoM" },
    }),

  // Backwards-compat alias for any cached imports.
  dashboard: async (): Promise<OverviewData> => api.overview(),

  agents: async (): Promise<Agent[]> => withLatency(agents, 80),

  knowledge: async (): Promise<KnowledgeFile[]> => withLatency(knowledgeFiles, 120),

  assistant: async (): Promise<{ threads: ChatThread[]; suggestions: string[] }> =>
    withLatency({ threads: chatThreads, suggestions: promptSuggestions }),

  automations: async (): Promise<Automation[]> => withLatency(automations, 80),

  analytics: async (): Promise<AnalyticsData> =>
    withLatency({
      kpis: [
        {
          label: "Estimated cost saved",
          value: "€1.84M",
          delta: "+32.4%",
          trend: "up",
          hint: "annualized",
          spark: [110, 130, 145, 160, 178, 195, 220, 240, 268, 290, 312, 340],
        },
        {
          label: "Hours reclaimed",
          value: "42,180",
          delta: "+18.2%",
          trend: "up",
          hint: "across all agents",
          spark: [180, 220, 260, 290, 320, 360, 410, 460, 510, 560, 620, 680],
        },
        {
          label: "Department efficiency",
          value: "+38%",
          delta: "+4.1pts",
          trend: "up",
          hint: "weighted avg.",
          spark: [22, 24, 26, 27, 29, 30, 32, 33, 34, 36, 37, 38],
        },
        {
          label: "Avg agent uptime",
          value: "99.94%",
          delta: "+0.18pts",
          trend: "up",
          hint: "rolling 90d",
          spark: [99.6, 99.7, 99.7, 99.8, 99.8, 99.8, 99.9, 99.9, 99.9, 99.94, 99.94, 99.94],
        },
      ],
      roi: roiData,
      byDept: usageByDept,
      agentPerformance: agentPerformanceData,
      agents,
    }),

  team: async (): Promise<TeamMember[]> => withLatency(teamMembers),

  audit: async () => withLatency(auditEvents),

  companies: async () => withLatency(companies, 0),

  notifications: async () => withLatency(notifications, 0),

  marketing: async () => withLatency({ testimonials, howItWorks, faqs }, 0),
};

export type Api = typeof api;
