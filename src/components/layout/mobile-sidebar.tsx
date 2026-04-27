"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { mainNav, secondaryNav } from "@/lib/nav";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: Props) {
  const pathname = usePathname();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-0 top-0 h-dvh max-w-[280px] translate-x-0 translate-y-0 rounded-none border-r p-0 sm:rounded-none">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <div className="px-5 pt-5">
          <Logo />
        </div>
        <nav className="mt-6 px-3">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Platform
          </p>
          <ul className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium",
                      active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active && "text-brand")} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Workspace
          </p>
          <ul className="space-y-0.5">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium",
                      active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active && "text-brand")} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
