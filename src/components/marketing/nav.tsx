"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

const links = [
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "/security" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const openDemo = useDemoDialog((s) => s.openDialog);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:inline-flex"
          >
            <Link href="/onboarding">Start free pilot</Link>
          </Button>
          <Button size="sm" onClick={() => openDemo("nav")}>
            <CalendarCheck className="h-4 w-4" />
            Book a demo
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border md:hidden">
          <div className="container flex flex-col gap-1 py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Start free pilot
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
