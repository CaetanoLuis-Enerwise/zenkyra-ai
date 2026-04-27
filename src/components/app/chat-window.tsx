"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Copy,
  Download,
  FileText,
  Sparkles,
  Plus,
  PanelLeft,
  ChevronRight,
  RefreshCw,
  Cpu,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  chatThreads,
  promptSuggestions,
  type ChatMessage,
  type ChatThread,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const seedAnswer = `Based on 142 closed-won EMEA deals in 2025, the median discount was 18.4%. Deals above €120k saw a sharp jump to 24.6%. I recommend tightening Tier-2 thresholds by 3 pts and introducing a value bundle for accounts above €80k ARR.

Key signals:
• Discount inflation accelerates above €100k ARR
• Win-rate improves only 2% above 22% discount — diminishing returns
• Bundling Support+SLA shifts 38% of deals out of discount territory

Want me to draft a one-pager you can share with sales leadership?`;

const MODELS = [
  { id: "zenkyra-pro", name: "Zenkyra Pro", desc: "Best quality · default" },
  { id: "zenkyra-fast", name: "Zenkyra Fast", desc: "Lower latency" },
  { id: "zenkyra-secure", name: "Zenkyra Secure", desc: "Self-hosted Llama 3" },
];

export function ChatWindow() {
  const [threads, setThreads] = React.useState<ChatThread[]>(chatThreads);
  const [activeId, setActiveId] = React.useState<string>(chatThreads[0].id);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [streamed, setStreamed] = React.useState("");
  const [historyOpen, setHistoryOpen] = React.useState(true);
  const [model, setModel] = React.useState(MODELS[0]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId)!;

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active.messages.length, streamed]);

  function send(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text || streaming) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, userMsg], updated: "Just now", preview: text }
          : t
      )
    );

    setStreaming(true);
    setStreamed("");

    let i = 0;
    const interval = setInterval(() => {
      i += Math.max(2, Math.floor(Math.random() * 6));
      setStreamed(seedAnswer.slice(0, i));
      if (i >= seedAnswer.length) {
        clearInterval(interval);
        const aiMsg: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          role: "assistant",
          content: seedAnswer,
          sources: [
            { title: "Q1 Sales Playbook.pdf", doc: "Sales", page: 24 },
            { title: "Annual Forecast.xlsx", doc: "Finance", page: 3 },
          ],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, messages: [...t.messages, aiMsg] } : t
          )
        );
        setStreaming(false);
        setStreamed("");
      }
    }, 22);
  }

  function regenerate() {
    if (streaming) return;
    const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: t.messages.filter((_, idx, arr) => {
                if (idx < arr.length - 1) return true;
                return arr[idx].role !== "assistant";
              }),
            }
          : t
      )
    );
    setStreaming(true);
    setStreamed("");
    let i = 0;
    const interval = setInterval(() => {
      i += Math.max(2, Math.floor(Math.random() * 6));
      setStreamed(seedAnswer.slice(0, i));
      if (i >= seedAnswer.length) {
        clearInterval(interval);
        const aiMsg: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          role: "assistant",
          content: seedAnswer,
          sources: [
            { title: "Q1 Sales Playbook.pdf", doc: "Sales", page: 24 },
            { title: "Annual Forecast.xlsx", doc: "Finance", page: 3 },
          ],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, messages: [...t.messages, aiMsg] } : t
          )
        );
        setStreaming(false);
        setStreamed("");
      }
    }, 22);
  }

  function newThread() {
    const id = `t-${Date.now()}`;
    const newT: ChatThread = {
      id,
      title: "New conversation",
      preview: "Start chatting…",
      updated: "Just now",
      messages: [],
    };
    setThreads([newT, ...threads]);
    setActiveId(id);
  }

  return (
    <Card className="grid h-[calc(100dvh-7.5rem)] grid-cols-1 overflow-hidden md:grid-cols-[260px_1fr]">
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card/40 transition-all",
          historyOpen ? "block" : "hidden md:hidden"
        )}
      >
        <div className="flex items-center justify-between p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            History
          </p>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={newThread}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <ul className="space-y-0.5 px-2 pb-2">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "block w-full rounded-md px-2.5 py-2 text-left transition-colors",
                    activeId === t.id ? "bg-accent" : "hover:bg-accent/60"
                  )}
                >
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{t.updated}</p>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>

      <div className="flex min-h-0 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setHistoryOpen((v) => !v)}
              aria-label="Toggle history"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <div>
              <p className="text-sm font-medium">{active.title}</p>
              <p className="text-xs text-muted-foreground">
                Grounded on Acme Inc. private knowledge
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Cpu className="h-3.5 w-3.5" />
                  {model.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Inference engine</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MODELS.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => setModel(m)}
                    className="flex-col items-start gap-0.5"
                  >
                    <div className="flex w-full items-center justify-between">
                      <p className="text-sm font-medium">{m.name}</p>
                      {m.id === model.id && <Check className="h-3.5 w-3.5 text-brand" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="success">
              <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
              Online
            </Badge>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {active.messages.length === 0 && !streaming ? (
            <EmptyChat onPick={(p) => send(p)} />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {active.messages.map((m, idx) => (
                <Message
                  key={m.id}
                  message={m}
                  onRegenerate={
                    !streaming &&
                    m.role === "assistant" &&
                    idx === active.messages.length - 1
                      ? regenerate
                      : undefined
                  }
                />
              ))}
              {streaming && (
                <AssistantBubble streaming content={streamed || "…"} sources={[]} />
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background/80 p-4">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-card focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/20">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask anything about your company knowledge…"
                className="min-h-[52px] border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {promptSuggestions.slice(0, 2).map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={() => send()}
                  disabled={!input.trim() || streaming}
                >
                  Send
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Answers grounded on your private documents. Verify before sending externally.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyChat({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Sparkles className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">
        How can Zenkyra help today?
      </h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Ask questions, draft documents, summarize meetings — all grounded on your private knowledge base.
      </p>
      <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {promptSuggestions.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="group flex items-center justify-between rounded-lg border border-border bg-card p-3 text-left text-sm transition hover:border-brand/40 hover:bg-accent"
          >
            <span>{p}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({
  message,
  onRegenerate,
}: {
  message: ChatMessage;
  onRegenerate?: () => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-xs">SA</AvatarFallback>
        </Avatar>
        <div className="rounded-xl bg-secondary px-3.5 py-2.5 text-sm">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <AssistantBubble
      content={message.content}
      sources={message.sources ?? []}
      onRegenerate={onRegenerate}
    />
  );
}

function AssistantBubble({
  content,
  sources,
  streaming = false,
  onRegenerate,
}: {
  content: string;
  sources: { title: string; doc: string; page: number }[];
  streaming?: boolean;
  onRegenerate?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-start gap-3"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm leading-6 whitespace-pre-wrap">
          {content}
          {streaming && (
            <span className="ml-0.5 inline-block h-3.5 w-1.5 -translate-y-0.5 animate-pulse bg-foreground align-middle" />
          )}
        </div>
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
              <a
                key={i}
                href="#"
                className="group flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs transition hover:border-brand/40 hover:bg-accent"
              >
                <FileText className="h-3.5 w-3.5 text-brand" />
                <span className="font-medium">{s.title}</span>
                <span className="text-muted-foreground">· p.{s.page}</span>
              </a>
            ))}
          </div>
        )}
        {!streaming && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                navigator.clipboard?.writeText(content).catch(() => {});
                toast.success("Answer copied to clipboard");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() =>
                toast.success("Exporting answer", {
                  description: "We'll email you a clean PDF in a moment.",
                })
              }
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={onRegenerate}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
