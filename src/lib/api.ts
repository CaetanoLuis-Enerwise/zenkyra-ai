/**
 * Thin async data layer.
 *
 * Today these helpers wrap the in-memory mock data with a simulated
 * latency so the UI behaves like a real product (Suspense + loading.tsx
 * skeletons fire). Tomorrow you swap the body of any helper for a
 * `fetch`, tRPC call or Server Action — the call sites stay identical.
 *
 * Not wired to FastAPI. Money / ROI / uptime figures are empty until a
 * live tenant produces them — never invented euros.
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

const NO_LIVE_VALUE = "—";

export const api = {
  overview: async (): Promise<OverviewData> =>
    withLatency({
      stats: overviewStats,
      usage: usageData,
      adoption: departmentAdoption,
      activity: recentActivity,
      agents,
      monthlySaved: { value: NO_LIVE_VALUE, deltaPct: NO_LIVE_VALUE },
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
          value: NO_LIVE_VALUE,
          delta: NO_LIVE_VALUE,
          trend: "flat",
          hint: "No live tenant data",
          spark: [],
        },
        {
          label: "Hours reclaimed",
          value: NO_LIVE_VALUE,
          delta: NO_LIVE_VALUE,
          trend: "flat",
          hint: "No live tenant data",
          spark: [],
        },
        {
          label: "Department efficiency",
          value: NO_LIVE_VALUE,
          delta: NO_LIVE_VALUE,
          trend: "flat",
          hint: "No live tenant data",
          spark: [],
        },
        {
          label: "Avg agent uptime",
          value: NO_LIVE_VALUE,
          delta: NO_LIVE_VALUE,
          trend: "flat",
          hint: "No live tenant data",
          spark: [],
        },
      ],
      roi: roiData.map(({ month }) => ({ month, saved: 0, invested: 0 })),
      byDept: usageByDept.map((row) => ({ ...row, value: 0 })),
      agentPerformance: agentPerformanceData.map((row) => ({ ...row, value: 0 })),
      agents,
    }),

  team: async (): Promise<TeamMember[]> => withLatency(teamMembers),

  audit: async () => withLatency(auditEvents),

  companies: async () => withLatency(companies, 0),

  notifications: async () => withLatency(notifications, 0),

  marketing: async () => withLatency({ testimonials, howItWorks, faqs }, 0),
};

export type Api = typeof api;
