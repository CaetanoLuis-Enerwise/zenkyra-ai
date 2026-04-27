"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileType2,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadZone } from "@/components/app/upload-zone";
import { cn } from "@/lib/utils";
import type { KnowledgeFile } from "@/lib/mock-data";

const CATEGORY_ORDER: KnowledgeFile["category"][] = [
  "HR",
  "Sales",
  "Legal",
  "Ops",
  "Finance",
];

interface Props {
  files: KnowledgeFile[];
}

export function KnowledgeTable({ files }: Props) {
  const [active, setActive] = React.useState<"All" | KnowledgeFile["category"]>("All");
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(() => {
    const c = { All: files.length } as Record<string, number>;
    CATEGORY_ORDER.forEach((cat) => {
      c[cat] = files.filter((f) => f.category === cat).length;
    });
    return c;
  }, [files]);

  const filtered = React.useMemo(() => {
    return files.filter((f) => {
      const matchCat = active === "All" || f.category === active;
      const matchQuery = !query || f.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [active, query, files]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-3">
        <Card className="p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </p>
          <ul className="space-y-0.5">
            <CatButton
              label="All"
              count={counts.All}
              active={active === "All"}
              onClick={() => setActive("All")}
            />
            {CATEGORY_ORDER.map((cat) => (
              <CatButton
                key={cat}
                label={cat}
                count={counts[cat] ?? 0}
                active={active === cat}
                onClick={() => setActive(cat)}
              />
            ))}
          </ul>
        </Card>

        <Card className="p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Storage
          </p>
          <div className="px-2 pb-2 text-sm">
            <p className="font-medium">38.4 GB used</p>
            <p className="text-xs text-muted-foreground">of 200 GB plan</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[19%] bg-brand" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Embedding model
          </p>
          <div className="px-2 pb-2 text-sm">
            <p className="font-medium">zenkyra-embed-v3</p>
            <p className="text-xs text-muted-foreground">1536d · 256 chunk</p>
          </div>
        </Card>
      </aside>

      <div className="space-y-5">
        <UploadZone />

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <span>
                {filtered.length} {filtered.length === 1 ? "document" : "documents"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Document</th>
                  <th className="px-4 py-2.5 text-left font-medium">Category</th>
                  <th className="px-4 py-2.5 text-left font-medium">Size</th>
                  <th className="px-4 py-2.5 text-left font-medium">Uploaded</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((f) => (
                  <FileRow key={f.id} file={f} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No documents match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CatButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-brand/10 text-brand"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <span>{label}</span>
        <span className="text-xs text-muted-foreground">{count}</span>
      </button>
    </li>
  );
}

function FileRow({ file }: { file: KnowledgeFile }) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const Icon =
    ext === "xlsx" ? FileSpreadsheet : ext === "docx" ? FileType2 : FileText;
  const tone =
    ext === "xlsx"
      ? "bg-success/10 text-success"
      : ext === "docx"
        ? "bg-brand/10 text-brand"
        : "bg-warning/10 text-warning";

  return (
    <tr className="transition-colors hover:bg-accent/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-md", tone)}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{file.pages} pages</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{file.category}</Badge>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{file.size}</td>
      <td className="px-4 py-3 text-muted-foreground">{file.uploaded}</td>
      <td className="px-4 py-3">
        <StatusBadge status={file.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Retrain">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: KnowledgeFile["status"] }) {
  if (status === "Indexed")
    return (
      <Badge variant="success">
        <CheckCircle2 className="h-3 w-3" />
        Indexed
      </Badge>
    );
  if (status === "Processing")
    return (
      <Badge variant="warning">
        <Loader2 className="h-3 w-3 animate-spin" />
        Processing
      </Badge>
    );
  return (
    <Badge variant="destructive">
      <AlertCircle className="h-3 w-3" />
      Failed
    </Badge>
  );
}
