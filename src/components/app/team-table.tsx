"use client";

import * as React from "react";
import { Search, MoreHorizontal, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials, cn } from "@/lib/utils";
import type { TeamMember } from "@/lib/mock-data";

const ROLES: TeamMember["role"][] = ["Admin", "Manager", "User", "Restricted"];

const AVATAR_COLORS = [
  "bg-brand/15 text-brand",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-destructive/15 text-destructive",
  "bg-muted text-foreground",
];

function pickColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

interface Props {
  members: TeamMember[];
}

export function TeamTable({ members }: Props) {
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState<"All" | TeamMember["role"]>("All");

  const filtered = React.useMemo(() => {
    return members.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase()) ||
        m.department.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role === "All" || m.role === role;
      return matchesQuery && matchesRole;
    });
  }, [members, query, role]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, department…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(["All", ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                role === r
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Role</th>
              <th className="px-4 py-2.5 text-left font-medium">Department</th>
              <th className="px-4 py-2.5 text-left font-medium">Last active</th>
              <th className="px-4 py-2.5 text-left font-medium">Permissions</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((m) => (
              <MemberRow key={m.id} m={m} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No teammates match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border bg-card/40 px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          {filtered.length} of {members.length} members
        </span>
        <span>Updated just now</span>
      </div>
    </Card>
  );
}

function MemberRow({ m }: { m: TeamMember }) {
  return (
    <tr className="transition-colors hover:bg-accent/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className={cn("text-xs", pickColor(m.name))}>
              {initials(m.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium">{m.name}</p>
            <p className="truncate text-xs text-muted-foreground">{m.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge role={m.role} />
      </td>
      <td className="px-4 py-3 text-muted-foreground">{m.department}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs",
            m.lastActive === "Active now"
              ? "text-success"
              : "text-muted-foreground"
          )}
        >
          {m.lastActive === "Active now" && (
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
          )}
          {m.lastActive}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {m.permissions.slice(0, 3).map((p) => (
            <Badge key={p} variant="secondary" className="text-[10px]">
              {p}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Member actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Change role</DropdownMenuItem>
            <DropdownMenuItem>Reset access</DropdownMenuItem>
            <DropdownMenuItem>View audit logs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function RoleBadge({ role }: { role: TeamMember["role"] }) {
  const map: Record<TeamMember["role"], { label: string; cls: string }> = {
    Admin: { label: "Admin", cls: "bg-brand/10 text-brand" },
    Manager: { label: "Manager", cls: "bg-success/10 text-success" },
    User: { label: "User", cls: "bg-secondary text-foreground" },
    Restricted: { label: "Restricted", cls: "bg-warning/10 text-warning" },
  };
  const v = map[role];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        v.cls
      )}
    >
      <Shield className="h-3 w-3" />
      {v.label}
    </span>
  );
}
