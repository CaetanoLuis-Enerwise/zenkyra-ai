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
import { promptSuggestions } from "@/lib/mock-data";
import { Sparkles, Upload, FileText, Users, Plus } from "lucide-react";

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
      <CommandInput placeholder="Search pages, ask AI, or run actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/assistant")}>
            <Sparkles className="text-brand" />
            Ask Zenkyra AI
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/knowledge")}>
            <Upload />
            Upload documents
          </CommandItem>
          <CommandItem onSelect={() => go("/workflows")}>
            <Plus />
            Create workflow
          </CommandItem>
          <CommandItem onSelect={() => go("/team")}>
            <Users />
            Invite team
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Suggested prompts">
          {promptSuggestions.map((p) => (
            <CommandItem key={p} onSelect={() => go("/assistant")}>
              <FileText />
              {p}
            </CommandItem>
          ))}
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
