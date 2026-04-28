import Link from "next/link";
import { Globe2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/overview" },
      { label: "Agents", href: "/agents" },
      { label: "Workflows", href: "/workflows" },
      { label: "Knowledge Hub", href: "/knowledge" },
      { label: "Analytics", href: "/analytics" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Trust center", href: "/security" },
      { label: "API reference", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "DPA", href: "#" },
      { label: "Sub-processors", href: "#" },
      { label: "Acceptable use", href: "#" },
    ],
  },
];

const compliance = [
  "SOC 2 Type II",
  "ISO 27001",
  "ISO 27701",
  "GDPR",
  "HIPAA-ready",
  "EU AI Act-aligned",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Digital workforce for modern companies. Hire autonomous AI agents that perform real business work — privately, in your tenant.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                <Link href="#" className="font-medium hover:text-foreground">
                  All systems operational
                </Link>
                <span>·</span>
                <span>99.99% uptime</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5" />
                Hosted in eu-central-1 · Frankfurt
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trust report available on request
              </span>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {compliance.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium"
              >
                <ShieldCheck className="h-3 w-3 text-success" />
                {c}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Zenkyra AI · Lisbon · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
