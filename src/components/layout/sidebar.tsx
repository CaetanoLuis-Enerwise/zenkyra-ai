"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Globe2, ShieldCheck } from "lucide-react";
import { mainNav, secondaryNav } from "@/lib/nav";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LIVE_MODE } from "@/lib/config";
import { LiveWorkspaceCard } from "@/components/live/live-user-menu";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex sticky top-0 z-30 h-dvh w-64 shrink-0 flex-col border-r border-border bg-background/60 backdrop-blur-md">
      <div className="flex items-center gap-2 px-5 pt-5">
        <Logo />
      </div>

      {LIVE_MODE ? (
        <LiveWorkspaceCard />
      ) : (
      <div className="px-3 pt-4">
        <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-card/50 px-2.5 py-2 text-left">
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarFallback className="rounded-md bg-brand/15 text-brand">
              D
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Demo workspace</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Sample layout · not a customer
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-3 w-3" />
            Demo data
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            No SOC 2 yet
          </span>
        </div>
      </div>
      )}

      <nav className="mt-4 flex-1 overflow-y-auto px-3 scrollbar-thin">
        <SectionLabel>Platform</SectionLabel>
        <ul className="space-y-0.5">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && !LIVE_MODE && (
                    <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <SectionLabel className="mt-6">Workspace</SectionLabel>
        <ul className="space-y-0.5">
          {secondaryNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-xl border border-border bg-gradient-to-br from-brand/10 via-brand/5 to-transparent p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold">Upgrade to Enterprise</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Private deployment and SSO are on the roadmap. Hosting region agreed in writing.
        </p>
        <Button size="sm" className="mt-3 w-full">
          Talk to sales
        </Button>
      </div>
    </aside>
  );
}

function SectionLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "px-2.5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80",
        className
      )}
    >
      {children}
    </p>
  );
}
