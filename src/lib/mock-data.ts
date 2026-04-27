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
  type: "proposal" | "ticket" | "search" | "lead" | "upload" | "automation";
  title: string;
  description: string;
  time: string;
  user: string;
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

export const dashboardStats: Stat[] = [
  {
    label: "Hours Saved This Month",
    value: "1,284",
    delta: "+18.2%",
    trend: "up",
    hint: "vs last month",
    spark: sparkSeries(80, 35),
  },
  {
    label: "Queries Answered",
    value: "42,917",
    delta: "+9.4%",
    trend: "up",
    hint: "across 6 teams",
    spark: sparkSeries(2800, 900),
  },
  {
    label: "Documents Indexed",
    value: "8,402",
    delta: "+3.1%",
    trend: "up",
    hint: "84 added today",
    spark: sparkSeries(540, 90),
  },
  {
    label: "Active Automations",
    value: "27",
    delta: "+4",
    trend: "up",
    hint: "3 scaling up",
    spark: sparkSeries(20, 8),
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
    type: "proposal",
    title: "Proposal generated",
    description: "Proposal for Northwind Logistics drafted and sent to legal.",
    time: "2m ago",
    user: "Sales Agent",
  },
  {
    id: "a2",
    type: "ticket",
    title: "Ticket answered",
    description: "Refund inquiry #4821 resolved with policy reference.",
    time: "12m ago",
    user: "Support Triage",
  },
  {
    id: "a3",
    type: "search",
    title: "SOP searched",
    description: '"Onboarding new hire" procedure surfaced for HR.',
    time: "27m ago",
    user: "Maria K.",
  },
  {
    id: "a4",
    type: "lead",
    title: "Lead replied",
    description: "Auto-reply sent to inbound enterprise lead.",
    time: "41m ago",
    user: "Lead Agent",
  },
  {
    id: "a5",
    type: "upload",
    title: "Documents indexed",
    description: "12 finance reports indexed and embedded.",
    time: "1h ago",
    user: "James P.",
  },
  {
    id: "a6",
    type: "automation",
    title: "Workflow triggered",
    description: "Meeting summary delivered to #ops channel.",
    time: "3h ago",
    user: "Meeting Bot",
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

export const topAutomationsData = [
  { name: "Support Triage", value: 318 },
  { name: "Lead Response", value: 142 },
  { name: "Proposal Gen.", value: 96 },
  { name: "Invoice Assistant", value: 88 },
  { name: "Meeting Summaries", value: 71 },
];

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
  "Summarize onboarding process",
  "Draft client proposal",
  "Explain refund policy",
  "Generate follow-up email",
];

export const testimonials = [
  {
    quote:
      "Zenkyra replaced 4 internal tools and freed our ops team from 12 hours of weekly busywork. ROI was measurable within the first quarter.",
    author: "Helena Schmidt",
    role: "COO, Northwind",
    company: "Northwind",
  },
  {
    quote:
      "Finally an AI platform our security team approves. EU residency, full audit trail, and our knowledge never leaves our tenant.",
    author: "David Reyes",
    role: "CISO, Constella",
    company: "Constella",
  },
  {
    quote:
      "Sales reps using Zenkyra close 22% faster. Proposals are drafted in minutes, grounded on our playbook.",
    author: "Marta Oliveira",
    role: "VP Sales, Vertex",
    company: "Vertex",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Connect your knowledge",
    description:
      "Drag-drop documents or sync Drive, Notion, Slack and SharePoint. We chunk, embed and index — fully tenant-isolated.",
  },
  {
    step: "02",
    title: "Compose your agents",
    description:
      "Pick from battle-tested templates or compose your own multi-step workflows. Bring humans in the loop where it matters.",
  },
  {
    step: "03",
    title: "Measure the lift",
    description:
      "Watch hours saved, ROI and adoption climb in real time. Export executive reports in one click.",
  },
];

export const faqs = [
  {
    q: "How is Zenkyra different from ChatGPT Enterprise or Microsoft Copilot?",
    a: "ChatGPT Enterprise and Copilot are great chat tools — Zenkyra is a private intelligence layer. We deploy single-tenant inside your VPC, ground every answer on your documents with page-level citations, and ship production-grade agents that act on your business. Bring your own LLM (Azure, AWS Bedrock, Anthropic, Mistral, self-hosted Llama 3) and switch any time.",
  },
  {
    q: "Where is my data stored, and will any of it train a model?",
    a: "Your data lives in eu-central-1 (Frankfurt) or eu-west-1 (Lisbon) by default — never the US. On Enterprise you bring your own cloud account with VPC isolation. Your knowledge, queries and documents are tenant-isolated and never used to train shared or public models. Ever.",
  },
  {
    q: "How long does it take to go live, and what does the pilot cost?",
    a: "Most pilots are live in under 7 days. Enterprise deployments with SSO, SCIM and private VPC peering typically take 2–4 weeks. The 14-day pilot is free, no credit card and no procurement required — you only pay once value is proven.",
  },
  {
    q: "What does our security and compliance team need to review?",
    a: "We share a full Trust Pack pre-call: SOC 2 Type II, ISO 27001 reports, GDPR & sub-processor list, sample DPA, pen-test summary, BCP/DR docs and SIG Lite. Our average IT review cleared in 11 days last quarter.",
  },
  {
    q: "What if it doesn't work for us?",
    a: "Exit anytime in the first 90 days with a full data export (zero lock-in) and we hand back any unused fees pro-rata. We track adoption weekly and publicly publish customer ROI — we only succeed when you do.",
  },
  {
    q: "Who owns the project on our side?",
    a: "You'll work with a dedicated CSM plus a senior solutions engineer for the pilot. We co-design the first three workflows with your team, then hand the keys over. You stay in control of every model, prompt and data source — always.",
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
    actor: "James Carter",
    event: "Document accessed",
    detail: "Q1 Sales Playbook.pdf · viewed in Assistant.",
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
    title: "Index complete",
    description: "12 finance reports indexed and embedded.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    title: "New automation run",
    description: "Lead Response Agent replied to 4 leads in the last hour.",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Security audit",
    description: "SOC 2 evidence updated by Vanta sync.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    title: "Workspace upgraded",
    description: "Storage limit increased to 200 GB.",
    time: "Yesterday",
    unread: false,
  },
];
