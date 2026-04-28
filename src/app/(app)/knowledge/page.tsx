import { Bot, RefreshCw, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KnowledgeTable } from "@/components/app/knowledge-table";
import { api } from "@/lib/api";

export default async function KnowledgePage() {
  const [files, agents] = await Promise.all([api.knowledge(), api.agents()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Train your workforce"
        title="Knowledge Hub"
        description="Upload documents once. Every Zenkyra agent inherits the same private, grounded knowledge — with page-level citations and tenant-only storage."
        meta={
          <>
            <span>{files.length.toLocaleString()} documents indexed</span>
            <span className="hidden md:inline">·</span>
            <span>zenkyra-embed-v3 · 1,536-d</span>
            <span className="hidden md:inline">·</span>
            <span>Last index 14 minutes ago</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4" />
              Sync sources
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4" />
              Retrain all agents
            </Button>
          </>
        }
      />

      <Card className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold">
                {agents.length} agents are reading from this hub
              </h3>
              <p className="text-sm text-muted-foreground">
                Re-train any agent on a subset of documents — or all of them at once.
              </p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            {agents.map((a) => (
              <li key={a.id}>
                <Badge variant="muted" className="text-xs">
                  <span
                    className={
                      a.status === "active"
                        ? "mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success"
                        : a.status === "training"
                          ? "mr-1 inline-block h-1.5 w-1.5 rounded-full bg-warning"
                          : "mr-1 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40"
                    }
                  />
                  {a.name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <KnowledgeTable files={files} />
    </div>
  );
}
