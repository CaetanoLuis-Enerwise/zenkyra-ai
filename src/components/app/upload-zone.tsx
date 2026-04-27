"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CloudUpload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFiles?: (files: File[]) => void;
}

export function UploadZone({ onFiles }: UploadZoneProps) {
  const [drag, setDrag] = React.useState(false);
  const [recent, setRecent] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);
    setRecent((prev) => [...arr.map((f) => f.name), ...prev].slice(0, 4));
    onFiles?.(arr);
  }

  return (
    <div className="space-y-3">
      <motion.label
        htmlFor="upload-input"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        animate={{ scale: drag ? 1.01 : 1 }}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 p-10 text-center transition-colors",
          drag ? "border-brand bg-brand/5" : "border-border hover:border-brand/50 hover:bg-accent/50"
        )}
      >
        <input
          ref={inputRef}
          id="upload-input"
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.txt,.md,.csv"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <CloudUpload className="h-6 w-6" />
        </span>
        <h3 className="text-base font-semibold">Drop your files to ingest</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          We automatically chunk, embed and index. Supports PDF, DOCX, XLSX, MD, CSV — up to 200MB per file.
        </p>
        <Button
          type="button"
          className="mt-4"
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
        >
          Select files
        </Button>
      </motion.label>

      {recent.length > 0 && (
        <div className="rounded-xl border border-border bg-card/60 p-3">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Just added
          </p>
          <ul className="space-y-1">
            {recent.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{name}</span>
                <span className="text-xs text-warning">Processing…</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
