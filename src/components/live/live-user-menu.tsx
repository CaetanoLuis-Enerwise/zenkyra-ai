"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { initials } from "@/lib/utils";

/** Topbar user menu in live mode: real /auth/me, working logout. */
export function LiveUserMenu() {
  const { user, tenant, logout } = useAuth();
  const label = user?.full_name || user?.email || "Account";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-1 flex items-center gap-2 rounded-full p-0.5 transition hover:bg-accent" aria-label="Account menu">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-brand/15 text-brand">{initials(label)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          {user?.full_name && <p className="text-sm font-medium">{user.full_name}</p>}
          <p className="text-xs text-muted-foreground" data-testid="live-user-email">{user?.email}</p>
          {tenant && <p className="mt-1 text-xs text-muted-foreground">{tenant.name} · {user?.role}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => logout()}>
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Sidebar workspace card in live mode: the signed-in tenant, no mock workspaces. */
export function LiveWorkspaceCard() {
  const { tenant, user } = useAuth();
  const name = tenant?.name ?? "—";
  return (
    <div className="px-3 pt-4">
      <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-card/50 px-2.5 py-2">
        <Avatar className="h-7 w-7 rounded-md">
          <AvatarFallback className="rounded-md bg-brand/15 text-brand">{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" data-testid="live-tenant-name">{name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
