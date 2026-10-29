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
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Trust center", href: "/security" },
      { label: "Privacidade", href: "/privacidade" },
    ],
  },
];

const compliance = [
  "No SOC 2 yet",
  "EU-first",
  "DPA before any PDF",
  "Private tenant",
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
                <span>No published SLA yet</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5" />
                Hosting region confirmed in writing before any upload
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                DPA before any customer PDF
              </span>
            </div>
          </div>
          {cols.filter((c) => c.links.length > 0).map((c) => (
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
