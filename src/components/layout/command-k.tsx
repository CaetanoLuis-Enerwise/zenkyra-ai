"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { mainNav, secondaryNav } from "@/lib/nav";
import { Bot, GitBranch, Sparkles, Upload, UserPlus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandK({ open, onOpenChange }: Props) {
  const router = useRouter();
  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, hire an agent, or run actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/agents")}>
            <Bot className="text-brand" />
            Hire a new agent
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/workflows")}>
            <GitBranch />
            Build a workflow
          </CommandItem>
          <CommandItem onSelect={() => go("/knowledge")}>
            <Upload />
            Upload to Knowledge Hub
          </CommandItem>
          <CommandItem onSelect={() => go("/team")}>
            <UserPlus />
            Invite teammate
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Suggested briefings">
          <CommandItem onSelect={() => go("/analytics")}>
            <Sparkles />
            Brief me on this week's pipeline
          </CommandItem>
          <CommandItem onSelect={() => go("/agents")}>
            <Sparkles />
            Show top-performing agents
          </CommandItem>
          <CommandItem onSelect={() => go("/analytics")}>
            <Sparkles />
            Why did refund tickets spike?
          </CommandItem>
          <CommandItem onSelect={() => go("/analytics")}>
            <Sparkles />
            Summarize Q2 vendor invoices
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pages">
          {[...mainNav, ...secondaryNav].map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <Icon />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
