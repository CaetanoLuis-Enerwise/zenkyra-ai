import {
  LayoutDashboard,
  Database,
  Sparkles,
  Workflow,
  GitBranch,
  BarChart3,
  Users,
  CreditCard,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Knowledge Base", href: "/knowledge", icon: Database },
  { label: "AI Assistant", href: "/assistant", icon: Sparkles, badge: "New" },
  { label: "Automations", href: "/automations", icon: Workflow },
  { label: "Workflows", href: "/workflows", icon: GitBranch },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const secondaryNav: NavItem[] = [
  { label: "Team", href: "/team", icon: Users },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];
