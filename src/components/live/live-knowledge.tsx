"use client";

import * as React from "react";
import { CloudUpload, Loader2, MessageSquare, Plus, Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB, type ChatHistoryMessage, type DocumentOut } from "@/lib/api-client";
import { DASH, fmtBytes, fmtDate, useLiveData } from "./use-live-data";

// backend/app/services/document_processor.py: PDF via pypdf, everything else read as UTF-8 text.
const ACCEPT = ".pdf,.txt,.md,.csv";

function statusBadge(d: DocumentOut) {
  const v = d.status === "ready" ? "success" : d.status === "failed" ? "destructive" : "muted";
  return (
    <Badge variant={v} className="text-[10px]">
      {d.status}
    </Badge>
  );
}

function Documents() {
  const { api } = useAuth();
  const docs = useLiveData(() => api.listDocuments());
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { reload } = docs;

  // Poll while something is still being indexed.
  const pending = docs.data?.some((d) => d.status === "pending" || d.status === "processing");
  React.useEffect(() => {
    if (!pending) return;
    const t = setInterval(reload, 3000);
    return () => clearInterval(t);
  }, [pending, reload]);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setMessage(null);
    const list = Array.from(files);
    const tooBig = list.filter((f) => f.size > MAX_UPLOAD_BYTES);
    if (tooBig.length) {
      setMessage(`${tooBig.map((f) => f.name).join(", ")}: over the ${MAX_UPLOAD_MB}MB limit, not uploaded.`);
    }
    setBusy(true);
    try {
      for (const f of list.filter((x) => x.size <= MAX_UPLOAD_BYTES)) {
        await api.uploadDocument(f, f.name);
      }
    } catch (e) {
      setMessage(`Upload failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      reload();
    }
  }

  async function onDelete(d: DocumentOut) {
    if (!window.confirm(`Delete "${d.filename}"? Its file and search index entries are removed.`)) return;
    setMessage(null);
    try {
      await api.deleteDocument(d.id);
    } catch (e) {
      setMessage(`Delete failed: ${(e as Error).message}`);
    }
    reload();
  }

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Documents</h3>
          <p className="text-sm text-muted-foreground">
            PDF, TXT, MD or CSV, up to {MAX_UPLOAD_MB}MB per file. Text is extracted, chunked and indexed in your workspace.
          </p>
        </div>
        <div>
          <input ref={inputRef} id="live-upload" type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => onFiles(e.target.files)} />
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
            Upload
          </Button>
        </div>
      </div>
      {message && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {message}
        </p>
      )}
      <div className="mt-4" data-testid="live-documents">
        {docs.loading && !docs.data ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : docs.error ? (
          <p className="text-sm text-destructive">Could not load documents: {docs.error.message}</p>
        ) : docs.data && docs.data.length > 0 ? (
          <ul className="divide-y divide-border">
            {docs.data.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium">{d.filename}</span>
                {statusBadge(d)}
                <span className="hidden w-20 text-right text-xs text-muted-foreground sm:inline">{fmtBytes(d.size_bytes)}</span>
                <span className="hidden w-24 text-right text-xs text-muted-foreground md:inline">{fmtDate(d.created_at)}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Delete ${d.filename}`} onClick={() => onDelete(d)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground" data-testid="live-documents-empty">
            No documents yet.
          </p>
        )}
      </div>
    </Card>
  );
}

function Chat() {
  const { api, user } = useAuth();
  const key = user ? `zenkyra.conversation.${user.id}` : null;
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatHistoryMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Restore the last conversation for this user from the server.
  React.useEffect(() => {
    if (!key) return;
    const id = window.localStorage.getItem(key);
    if (!id) return;
    setConversationId(id);
    api
      .conversationMessages(id)
      .then(setMessages)
      .catch(() => {
        window.localStorage.removeItem(key);
        setConversationId(null);
      });
  }, [api, key]);

  function newConversation() {
    if (key) window.localStorage.removeItem(key);
    setConversationId(null);
    setMessages([]);
    setError(null);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setMessages((m) => [...m, { role: "user", content: text, created_at: new Date().toISOString() }]);
    setInput("");
    try {
      const r = await api.sendChatMessage(text, conversationId);
      setConversationId(r.conversation_id);
      if (key) window.localStorage.setItem(key, r.conversation_id);
      setMessages((m) => [...m, { role: "assistant", content: r.reply, created_at: new Date().toISOString() }]);
    } catch (err) {
      setError(`The assistant could not answer: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <MessageSquare className="h-4 w-4 text-brand" />
            Ask your documents
          </h3>
          <p className="text-sm text-muted-foreground">Answers use text retrieved from your indexed documents.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={newConversation}>
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>
      <div className="mt-4 min-h-[160px] flex-1 space-y-3 overflow-y-auto" data-testid="live-chat-messages">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-8 rounded-lg bg-brand/10 p-3 text-sm" : "mr-8 rounded-lg border border-border p-3 text-sm"}>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{m.role === "user" ? "You" : "Zenkyra"}</p>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ))
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <form onSubmit={send} className="mt-4 flex items-end gap-2">
        <Textarea
          aria-label="Message"
          value={input}
          maxLength={24000}
          rows={2}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents…"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  );
}

export function LiveKnowledge() {
  const { tenant } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live workspace"
        title="Knowledge Hub"
        description="Upload documents and ask questions about them. Everything here is stored in your tenant's own vector collection."
        meta={<span>Workspace: {tenant?.name ?? DASH}</span>}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Documents />
        <Chat />
      </div>
    </div>
  );
}
