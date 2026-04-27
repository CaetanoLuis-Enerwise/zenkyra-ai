import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { KnowledgeTable } from "@/components/app/knowledge-table";
import { api } from "@/lib/api";

export default async function KnowledgePage() {
  const files = await api.knowledge();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Single source of truth"
        title="Knowledge Base"
        description="Everything your AI agents are grounded on. Upload, organize and retrain in one place."
        meta={
          <>
            <span>{files.length.toLocaleString()} documents</span>
            <span className="hidden md:inline">·</span>
            <span>zenkyra-embed-v3 · 1536d</span>
            <span className="hidden md:inline">·</span>
            <span>Last index 14 minutes ago</span>
          </>
        }
        actions={
          <Button size="sm">
            <RefreshCw className="h-4 w-4" />
            Retrain index
          </Button>
        }
      />
      <KnowledgeTable files={files} />
    </div>
  );
}
