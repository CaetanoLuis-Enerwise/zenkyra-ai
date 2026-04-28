// Realistic mock data used across the Zenkyra AI app.
// Replace these helpers with real API calls when the backend is ready.

export type Trend = "up" | "down" | "flat";

export interface Stat {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  spark: number[];
  hint?: string;
}

export interface ActivityItem {
  id: string;
  type: "lead" | "ticket" | "invoice" | "report" | "ops" | "upload";
  title: string;
  description: string;
  time: string;
  agent: string;
  agentId?: string;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  category: "HR" | "Sales" | "Legal" | "Ops" | "Finance";
  size: string;
  uploaded: string;
  status: "Indexed" | "Processing" | "Failed";
  pages: number;
}

export type AgentRole = "sales" | "support" | "ops" | "finance" | "analyst";

export interface Agent {
  id: AgentRole;
  name: string;
  tagline: string;
  description: string;
  status: "active" | "training" | "draft";
  tasksCompleted: number;
  hoursSaved: number;
  accuracy: number;
  uptimeDays: number;
  trainedOn: string[];
  workflows: number;
  spark: number[];
  capabilities: string[];
  accent: "indigo" | "emerald" | "amber" | "violet" | "rose";
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  runs: number;
  hoursSaved: number;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User" | "Restricted";
  department: string;
  lastActive: string;
  permissions: string[];
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; doc: string; page: number }[];
  time: string;
}

export interface ChatThread {
  id: string;
  title: string;
  preview: string;
  updated: string;
  messages: ChatMessage[];
}

function sparkSeries(base: number, drift: number, len = 14): number[] {
  return Array.from({ length: len }).map((_, i) => {
    const wave = Math.sin(i / 1.7) * (base * 0.08);
    const trend = (drift * i) / len;
    const noise = (Math.sin(i * 13.37) * base) / 30;
    return Math.round(base + wave + trend + noise);
  });
}

export const overviewStats: Stat[] = [
  {
    label: "Tasks completed this month",
    value: "18,420",
    delta: "+24.6%",
    trend: "up",
    hint: "across all agents",
    spark: sparkSeries(1200, 480),
  },
  {
    label: "Hours saved",
    value: "4,217",
    delta: "+18.2%",
    trend: "up",
    hint: "vs last month",
    spark: sparkSeries(280, 110),
  },
  {
    label: "Revenue opportunities captured",
    value: "€2.4M",
    delta: "+31.0%",
    trend: "up",
    hint: "qualified by Sales Agent",
    spark: sparkSeries(160, 80),
  },
  {
    label: "Team productivity gain",
    value: "+38%",
    delta: "+4.1pts",
    trend: "up",
    hint: "across 6 departments",
    spark: sparkSeries(28, 12),
  },
];

// Kept for backwards compat with any cached imports. Now identical to overviewStats.
export const dashboardStats = overviewStats;

export const agents: Agent[] = [
  {
    id: "sales",
    name: "Sales Agent",
    tagline: "Qualifies leads, drafts replies, follows up.",
    description:
      "Auto-qualifies inbound leads, drafts replies in your voice and books follow-ups against your CRM.",
    status: "active",
    tasksCompleted: 4_812,
    hoursSaved: 612,
    accuracy: 97,
    uptimeDays: 142,
    trainedOn: ["Sales Playbook 2026", "Closed-won deals", "ICP & objections"],
    workflows: 6,
    spark: sparkSeries(140, 80),
    capabilities: [
      "Lead scoring · 0-100",
      "Personalized outbound replies",
      "CRM updates · HubSpot, Salesforce",
      "Meeting booking · Calendly, Outlook",
    ],
    accent: "indigo",
  },
  {
    id: "support",
    name: "Support Agent",
    tagline: "Answers tickets, classifies issues, escalates.",
    description:
      "Triages incoming tickets, drafts grounded answers from your SOPs and escalates only what truly needs a human.",
    status: "active",
    tasksCompleted: 9_420,
    hoursSaved: 1_184,
    accuracy: 96,
    uptimeDays: 142,
    trainedOn: ["Refund Policy v3.2", "Customer Success Runbook", "12 SOP categories"],
    workflows: 4,
    spark: sparkSeries(220, 70),
    capabilities: [
      "Ticket classification · 12 categories",
      "Sentiment + priority routing",
      "Grounded answer drafts with citations",
      "Smart escalation · sentiment < 0.3",
    ],
    accent: "emerald",
  },
  {
    id: "ops",
    name: "Ops Agent",
    tagline: "Handles SOPs, internal requests, tasks.",
    description:
      "Resolves internal requests, runs SOPs end-to-end and keeps every process consistent across teams.",
    status: "active",
    tasksCompleted: 2_104,
    hoursSaved: 318,
    accuracy: 98,
    uptimeDays: 89,
    trainedOn: ["Onboarding Handbook", "IT runbooks", "Vendor playbooks"],
    workflows: 5,
    spark: sparkSeries(80, 36),
    capabilities: [
      "SOP execution · runbooks",
      "Internal request routing",
      "Vendor & procurement triage",
      "Slack + Teams native",
    ],
    accent: "amber",
  },
  {
    id: "finance",
    name: "Finance Agent",
    tagline: "Processes invoices, summaries, reminders.",
    description:
      "Reads invoices, validates against POs, drafts month-end summaries and chases overdue payments — politely.",
    status: "active",
    tasksCompleted: 1_864,
    hoursSaved: 274,
    accuracy: 99,
    uptimeDays: 67,
    trainedOn: ["Vendor Pricing Q2", "Annual Forecast", "Approval matrix"],
    workflows: 4,
    spark: sparkSeries(120, 60),
    capabilities: [
      "Invoice OCR + PO matching",
      "Approval routing · ERP-aware",
      "Month-end variance summaries",
      "Polite payment reminders",
    ],
    accent: "violet",
  },
  {
    id: "analyst",
    name: "Executive Analyst",
    tagline: "Creates reports, detects trends, insights.",
    description:
      "Drafts board-ready reports, detects anomalies in the numbers and explains them in plain language to your leadership team.",
    status: "training",
    tasksCompleted: 312,
    hoursSaved: 96,
    accuracy: 94,
    uptimeDays: 21,
    trainedOn: ["Annual Forecast", "OKRs Q1-Q4", "Board materials"],
    workflows: 3,
    spark: sparkSeries(40, 22),
    capabilities: [
      "Weekly executive briefings",
      "Anomaly + trend detection",
      "Cross-functional ROI rollups",
      "Plain-language commentary",
    ],
    accent: "rose",
  },
];

export const usageData = Array.from({ length: 30 }).map((_, i) => {
  const base = 800 + Math.sin(i / 3) * 220 + i * 14;
  return {
    day: `D${i + 1}`,
    queries: Math.round(base + Math.random() * 90),
    automations: Math.round(base / 6 + Math.random() * 30),
  };
});

export const departmentAdoption = [
  { department: "Sales", adoption: 92 },
  { department: "Support", adoption: 88 },
  { department: "Operations", adoption: 74 },
  { department: "HR", adoption: 65 },
  { department: "Legal", adoption: 58 },
  { department: "Finance", adoption: 49 },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    type: "lead",
    title: "Lead qualified",
    description: "Northwind Logistics scored 87/100 · meeting booked for Thu 14:00.",
    time: "2m ago",
    agent: "Sales Agent",
    agentId: "sales",
  },
  {
    id: "a2",
    type: "ticket",
    title: "Ticket resolved",
    description: "Refund inquiry #4821 closed with policy ref · CSAT 4.9.",
    time: "12m ago",
    agent: "Support Agent",
    agentId: "support",
  },
  {
    id: "a3",
    type: "invoice",
    title: "Invoice processed",
    description: "PO #88231 matched · routed to Liam for 2-step approval.",
    time: "27m ago",
    agent: "Finance Agent",
    agentId: "finance",
  },
  {
    id: "a4",
    type: "ops",
    title: "SOP executed",
    description: "New-hire IT setup · all 7 steps completed in 4m 12s.",
    time: "41m ago",
    agent: "Ops Agent",
    agentId: "ops",
  },
  {
    id: "a5",
    type: "report",
    title: "Executive briefing drafted",
    description: "Weekly revenue digest delivered to #leadership.",
    time: "1h ago",
    agent: "Executive Analyst",
    agentId: "analyst",
  },
  {
    id: "a6",
    type: "upload",
    title: "Knowledge re-indexed",
    description: "12 finance reports embedded · all agents updated.",
    time: "3h ago",
    agent: "Knowledge Hub",
  },
];

export const knowledgeFiles: KnowledgeFile[] = [
  { id: "k1", name: "Onboarding Handbook 2026.pdf", category: "HR", size: "4.2 MB", uploaded: "2 days ago", status: "Indexed", pages: 84 },
  { id: "k2", name: "Master Services Agreement.docx", category: "Legal", size: "1.8 MB", uploaded: "5 days ago", status: "Indexed", pages: 32 },
  { id: "k3", name: "Q1 Sales Playbook.pdf", category: "Sales", size: "8.6 MB", uploaded: "1 week ago", status: "Indexed", pages: 142 },
  { id: "k4", name: "Refund Policy v3.2.pdf", category: "Ops", size: "0.9 MB", uploaded: "3 days ago", status: "Indexed", pages: 12 },
  { id: "k5", name: "Vendor Pricing Q2.xlsx", category: "Finance", size: "2.4 MB", uploaded: "12h ago", status: "Processing", pages: 9 },
  { id: "k6", name: "Customer Success Runbook.pdf", category: "Ops", size: "3.1 MB", uploaded: "1 day ago", status: "Indexed", pages: 56 },
  { id: "k7", name: "GDPR Compliance Brief.pdf", category: "Legal", size: "1.1 MB", uploaded: "1 week ago", status: "Indexed", pages: 22 },
  { id: "k8", name: "Performance Review Template.docx", category: "HR", size: "0.6 MB", uploaded: "2 weeks ago", status: "Indexed", pages: 6 },
  { id: "k9", name: "Annual Forecast.xlsx", category: "Finance", size: "5.7 MB", uploaded: "4 days ago", status: "Indexed", pages: 18 },
  { id: "k10", name: "Enterprise Outreach Scripts.docx", category: "Sales", size: "0.7 MB", uploaded: "3h ago", status: "Processing", pages: 8 },
];

export const automations: Automation[] = [
  {
    id: "auto1",
    name: "Lead Response Agent",
    description: "Replies to inbound leads with a personalized message under 90 seconds.",
    status: "active",
    runs: 1284,
    hoursSaved: 142,
    category: "Sales",
  },
  {
    id: "auto2",
    name: "Proposal Generator",
    description: "Drafts customized proposals from your playbook and pricing.",
    status: "active",
    runs: 312,
    hoursSaved: 96,
    category: "Sales",
  },
  {
    id: "auto3",
    name: "Support Triage",
    description: "Categorizes tickets and proposes answers grounded in your SOPs.",
    status: "active",
    runs: 8421,
    hoursSaved: 318,
    category: "Support",
  },
  {
    id: "auto4",
    name: "Meeting Summaries",
    description: "Delivers structured summaries and action items to your channels.",
    status: "paused",
    runs: 421,
    hoursSaved: 71,
    category: "Productivity",
  },
  {
    id: "auto5",
    name: "Invoice Assistant",
    description: "Reads invoices, validates against PO and routes for approval.",
    status: "active",
    runs: 612,
    hoursSaved: 88,
    category: "Finance",
  },
  {
    id: "auto6",
    name: "Onboarding Buddy",
    description: "Guides new hires through HR docs and tools in their first 7 days.",
    status: "draft",
    runs: 0,
    hoursSaved: 0,
    category: "HR",
  },
];

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Sofia Almeida", email: "sofia@acme.io", role: "Admin", department: "Operations", lastActive: "Active now", permissions: ["all"] },
  { id: "u2", name: "James Carter", email: "james@acme.io", role: "Manager", department: "Sales", lastActive: "12m ago", permissions: ["sales", "automations"] },
  { id: "u3", name: "Mariana Costa", email: "mariana@acme.io", role: "User", department: "Support", lastActive: "1h ago", permissions: ["chat", "knowledge"] },
  { id: "u4", name: "Liam O'Connor", email: "liam@acme.io", role: "Manager", department: "Finance", lastActive: "Yesterday", permissions: ["finance"] },
  { id: "u5", name: "Aiko Tanaka", email: "aiko@acme.io", role: "User", department: "HR", lastActive: "2d ago", permissions: ["chat"] },
  { id: "u6", name: "Noah Becker", email: "noah@acme.io", role: "Restricted", department: "Legal", lastActive: "3d ago", permissions: ["read-only"] },
  { id: "u7", name: "Priya Singh", email: "priya@acme.io", role: "User", department: "Sales", lastActive: "Active now", permissions: ["chat", "automations"] },
];

export const chatThreads: ChatThread[] = [
  {
    id: "t1",
    title: "Q2 EMEA pricing strategy",
    preview: "Compare last year's discounting bands…",
    updated: "Just now",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Compare last year's discounting bands for our EMEA enterprise deals and suggest improvements.",
        time: "12:01",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Based on 142 closed-won EMEA deals in 2025, the median discount was 18.4%. Deals above €120k saw a sharp jump to 24.6%. I recommend tightening Tier-2 thresholds by 3 pts and introducing a value bundle for accounts above €80k ARR. Want me to draft a one-pager you can share with sales leadership?",
        sources: [
          { title: "Q1 Sales Playbook.pdf", doc: "Sales", page: 24 },
          { title: "Annual Forecast.xlsx", doc: "Finance", page: 3 },
        ],
        time: "12:01",
      },
    ],
  },
  {
    id: "t2",
    title: "Onboarding checklist for new hires",
    preview: "Summarize the onboarding process…",
    updated: "2h ago",
    messages: [],
  },
  {
    id: "t3",
    title: "Refund policy edge cases",
    preview: "Explain the refund policy for…",
    updated: "Yesterday",
    messages: [],
  },
  {
    id: "t4",
    title: "Follow-up email — Acme Logistics",
    preview: "Generate a follow-up email…",
    updated: "2d ago",
    messages: [],
  },
];

export const roiData = Array.from({ length: 12 }).map((_, i) => {
  const month = new Date(2025, i, 1).toLocaleString("en", { month: "short" });
  return {
    month,
    saved: Math.round(8000 + i * 2400 + Math.random() * 1500),
    invested: 4500,
  };
});

export const agentPerformanceData = [
  { name: "Support Agent", value: 1184 },
  { name: "Sales Agent", value: 612 },
  { name: "Ops Agent", value: 318 },
  { name: "Finance Agent", value: 274 },
  { name: "Executive Analyst", value: 96 },
];

// Backwards compat alias.
export const topAutomationsData = agentPerformanceData;

export const usageByDept = [
  { department: "Sales", value: 38 },
  { department: "Support", value: 27 },
  { department: "Ops", value: 14 },
  { department: "HR", value: 11 },
  { department: "Finance", value: 7 },
  { department: "Legal", value: 3 },
];

export const companies = [
  { id: "c1", name: "Acme Inc.", plan: "Growth", logo: "A" },
  { id: "c2", name: "Northwind", plan: "Enterprise", logo: "N" },
  { id: "c3", name: "Globex Labs", plan: "Starter", logo: "G" },
];

export const promptSuggestions = [
  "Brief me on this week's pipeline",
  "Draft a follow-up to Northwind",
  "Why did refund tickets spike?",
  "Summarize Q2 vendor invoices",
];

export const testimonials = [
  {
    quote:
      "We hired the Zenkyra Sales Agent in May. By Q3 it had qualified 4,800 leads and booked 612 demos — without expanding the team. It paid for itself in 7 weeks.",
    author: "Helena Schmidt",
    role: "COO, Northwind",
    company: "Northwind",
  },
  {
    quote:
      "The Support Agent now handles 71% of tier-1 tickets autonomously, with citations our compliance team trusts. EU-resident, fully audited, zero data sharing.",
    author: "David Reyes",
    role: "CISO, Constella",
    company: "Constella",
  },
  {
    quote:
      "Finance close used to swallow a week. Our Finance Agent reconciles invoices in real time and our Executive Analyst writes the board memo. It feels like 8 new hires.",
    author: "Marta Oliveira",
    role: "CFO, Vertex",
    company: "Vertex",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Connect your knowledge",
    description:
      "Drop documents or sync Drive, Notion, Slack, SharePoint and your ERP. Indexed inside your tenant — never shared.",
  },
  {
    step: "02",
    title: "Hire your agents",
    description:
      "Activate Sales, Support, Ops, Finance or Executive Analyst. Each agent inherits your knowledge, voice and approval rules.",
  },
  {
    step: "03",
    title: "Watch the workforce work",
    description:
      "Live ROI dashboard for every executive. Hours saved, revenue captured and productivity gains — measurable from day one.",
  },
];

export const faqs = [
  {
    q: "What exactly does a Zenkyra agent do?",
    a: "A Zenkyra agent is an autonomous worker that performs a specific business job — qualifying leads, resolving tickets, processing invoices, drafting executive reports. It reads your knowledge, follows your rules, takes action across your tools (CRM, ERP, helpdesk, Slack), and asks a human only when policy requires.",
  },
  {
    q: "How is this different from ChatGPT Enterprise or Microsoft Copilot?",
    a: "Chat tools answer questions. Zenkyra agents do the work. They run on your private tenant, are grounded on your documents, act inside your CRM/ERP/helpdesk, and ship with audit trails, approval rules and SLAs. You can also bring your own LLM (Azure, Bedrock, Anthropic, Mistral, self-hosted Llama 3) and switch any time.",
  },
  {
    q: "Where is my data stored, and will any of it train a model?",
    a: "Your data lives in eu-central-1 (Frankfurt) or eu-west-1 (Lisbon) by default — never the US. On Enterprise you bring your own cloud account with VPC isolation. Your knowledge, queries and documents are tenant-isolated and never used to train shared or public models. Ever.",
  },
  {
    q: "How long does it take to deploy our first agent?",
    a: "Most pilots have an agent live in under 7 days. Enterprise deployments with SSO, SCIM and private VPC peering typically take 2–4 weeks. The 14-day pilot is free, no credit card and no procurement required — you only pay once value is proven.",
  },
  {
    q: "What does our security and compliance team need to review?",
    a: "We share a full Trust Pack pre-call: SOC 2 Type II, ISO 27001 reports, GDPR & sub-processor list, sample DPA, pen-test summary, BCP/DR docs and SIG Lite. Our average IT review cleared in 11 days last quarter.",
  },
  {
    q: "What if it doesn't work for us?",
    a: "Exit anytime in the first 90 days with a full data export (zero lock-in) and we hand back any unused fees pro-rata. We track adoption weekly and publicly publish customer ROI — we only succeed when you do.",
  },
];

export const auditEvents = [
  {
    id: "ae1",
    actor: "Sofia Almeida",
    event: "Permission updated",
    detail: "Granted Sales · automations to Priya Singh.",
    time: "2m ago",
    severity: "info" as const,
  },
  {
    id: "ae2",
    actor: "System",
    event: "API key rotated",
    detail: "Production key rotated by automated policy.",
    time: "1h ago",
    severity: "info" as const,
  },
  {
    id: "ae3",
    actor: "Sales Agent",
    event: "CRM action",
    detail: "Updated 12 deals in HubSpot · Northwind opportunity.",
    time: "3h ago",
    severity: "info" as const,
  },
  {
    id: "ae4",
    actor: "Security",
    event: "Sign-in from new device",
    detail: "Liam O'Connor · macOS · Lisbon, PT.",
    time: "Yesterday",
    severity: "warning" as const,
  },
  {
    id: "ae5",
    actor: "Compliance",
    event: "SOC 2 evidence updated",
    detail: "Vendor risk register synced from Vanta.",
    time: "2d ago",
    severity: "info" as const,
  },
];

export const notifications = [
  {
    id: "n1",
    title: "Sales Agent booked 4 meetings",
    description: "Northwind, Globex, Vertex and Acme Logistics confirmed for next week.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Support Agent SLA hit · 99.4%",
    description: "Median first response time held at 38 seconds across 1,217 tickets.",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Finance Agent flagged variance",
    description: "Vendor Pricing Q2 deviation +€48k vs forecast — review queued.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    title: "Executive Analyst report ready",
    description: "Weekly board digest delivered to #leadership.",
    time: "Yesterday",
    unread: false,
  },
];
