import {
  LayoutDashboard,
  Bot,
  GitBranch,
  Database,
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
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Agents", href: "/agents", icon: Bot, badge: "5" },
  { label: "Workflows", href: "/workflows", icon: GitBranch },
  { label: "Knowledge Hub", href: "/knowledge", icon: Database },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const secondaryNav: NavItem[] = [
  { label: "Team", href: "/team", icon: Users },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];
