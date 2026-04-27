"use client";

import * as React from "react";
import { Bell, Globe2, Lock, Menu, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandK } from "@/components/layout/command-k";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/lib/mock-data";

export function Topbar() {
  const [openK, setOpenK] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenK((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setOpenMobile(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <button
        onClick={() => setOpenK(true)}
        className="group flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search anything…</span>
        <span className="sm:hidden">Search</span>
        <kbd className="ml-auto hidden items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <TrustStrip />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="default" className="text-[10px]">
                {notifications.filter((n) => n.unread).length} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm font-medium">{n.title}</p>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{n.description}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full p-0.5 transition hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-brand/15 text-brand">SA</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Sofia Almeida</p>
              <p className="text-xs text-muted-foreground">sofia@acme.io</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Workspace settings</DropdownMenuItem>
            <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandK open={openK} onOpenChange={setOpenK} />
      <MobileSidebar open={openMobile} onOpenChange={setOpenMobile} />
    </header>
  );
}

function TrustStrip() {
  return (
    <div className="mr-1 hidden items-center gap-1 rounded-full border border-border bg-card/60 px-2 py-1 text-xs lg:flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 px-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="font-medium">Operational</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>All systems operational · 99.99% uptime</TooltipContent>
      </Tooltip>
      <span className="h-3 w-px bg-border" aria-hidden />
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 px-1.5 text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5" />
            <span className="hidden font-medium xl:inline">EU · Frankfurt</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>Region eu-central-1 · GDPR resident</TooltipContent>
      </Tooltip>
      <span className="h-3 w-px bg-border" aria-hidden />
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 px-1.5 text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden font-medium xl:inline">Encrypted</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>AES-256 at rest · TLS 1.3 in transit</TooltipContent>
      </Tooltip>
      <span className="h-3 w-px bg-border" aria-hidden />
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 px-1.5 text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden font-medium xl:inline">SOC 2</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>SOC 2 Type II · ISO 27001 · GDPR</TooltipContent>
      </Tooltip>
    </div>
  );
}
