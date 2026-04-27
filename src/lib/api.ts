/**
 * Thin async data layer.
 *
 * Today these helpers wrap the in-memory mock data with a simulated
 * latency so the UI behaves like a real product (Suspense + loading.tsx
 * skeletons fire). Tomorrow you swap the body of any helper for a
 * `fetch`, tRPC call or Server Action — the call sites stay identical.
 */

import {
  auditEvents,
  automations,
  chatThreads,
  companies,
  dashboardStats,
  departmentAdoption,
  faqs,
  howItWorks,
  knowledgeFiles,
  notifications,
  promptSuggestions,
  recentActivity,
  roiData,
  teamMembers,
  testimonials,
  topAutomationsData,
  usageByDept,
  usageData,
  type ActivityItem,
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

export interface DashboardData {
  stats: Stat[];
  usage: typeof usageData;
  adoption: typeof departmentAdoption;
  activity: ActivityItem[];
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
  topAutomations: typeof topAutomationsData;
}

export const api = {
  dashboard: async (): Promise<DashboardData> =>
    withLatency({
      stats: dashboardStats,
      usage: usageData,
      adoption: departmentAdoption,
      activity: recentActivity,
      monthlySaved: { value: "€38,420", deltaPct: "+24% MoM" },
    }),

  knowledge: async (): Promise<KnowledgeFile[]> => withLatency(knowledgeFiles, 120),

  assistant: async (): Promise<{ threads: ChatThread[]; suggestions: string[] }> =>
    withLatency({ threads: chatThreads, suggestions: promptSuggestions }),

  automations: async (): Promise<Automation[]> => withLatency(automations, 80),

  analytics: async (): Promise<AnalyticsData> =>
    withLatency({
      kpis: [
        {
          label: "Estimated cost saved",
          value: "€384,210",
          delta: "+22.4%",
          trend: "up",
          hint: "vs last quarter",
          spark: [110, 130, 145, 160, 178, 195, 220, 240, 268, 290, 312, 340],
        },
        {
          label: "Productivity gain",
          value: "+38%",
          delta: "+4.1pts",
          trend: "up",
          hint: "across all teams",
          spark: [22, 24, 26, 27, 29, 30, 32, 33, 34, 36, 37, 38],
        },
        {
          label: "Avg response time",
          value: "−62%",
          delta: "2m 18s",
          trend: "down",
          hint: "support tickets",
          spark: [80, 76, 72, 70, 66, 60, 54, 50, 46, 42, 40, 38],
        },
        {
          label: "Monthly active users",
          value: "412",
          delta: "+11.0%",
          trend: "up",
          hint: "across 6 departments",
          spark: [240, 260, 270, 290, 310, 330, 350, 366, 380, 395, 405, 412],
        },
      ],
      roi: roiData,
      byDept: usageByDept,
      topAutomations: topAutomationsData,
    }),

  team: async (): Promise<TeamMember[]> => withLatency(teamMembers),

  audit: async () => withLatency(auditEvents),

  companies: async () => withLatency(companies, 0),

  notifications: async () => withLatency(notifications, 0),

  marketing: async () => withLatency({ testimonials, howItWorks, faqs }, 0),
};

export type Api = typeof api;
