"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Plug,
  Copy,
  RotateCw,
  Trash2,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const integrations = [
  { name: "Slack", desc: "Push answers and summaries to channels.", connected: true },
  { name: "Notion", desc: "Sync your workspace pages and docs.", connected: true },
  { name: "Salesforce", desc: "Lead context and proposal generation.", connected: false },
  { name: "Google Drive", desc: "Index Docs, Sheets and Slides.", connected: true },
  { name: "HubSpot", desc: "CRM context for sales workflows.", connected: false },
  { name: "Jira", desc: "Triage tickets with AI assistance.", connected: false },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your workspace, branding, integrations and API access."
      />

      <Tabs defaultValue="general">
        <TabsList className="w-full max-w-2xl justify-start overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h3 className="text-base font-semibold">Workspace</h3>
            <p className="text-sm text-muted-foreground">
              Public information shown to your team and partners.
            </p>
            <Separator className="my-5" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Workspace name">
                <Input defaultValue="Acme Inc." />
              </Field>
              <Field label="Default region">
                <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>EU — Frankfurt (eu-central-1)</option>
                  <option>EU — Lisbon (eu-west-1)</option>
                  <option>US — Virginia (us-east-1)</option>
                </select>
              </Field>
              <Field label="Domain" hint="Used for SSO and email allow-list">
                <Input defaultValue="acme.io" />
              </Field>
              <Field label="Timezone">
                <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Europe/Lisbon</option>
                  <option>Europe/Madrid</option>
                  <option>Europe/Berlin</option>
                  <option>America/New_York</option>
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button
                onClick={() =>
                  toast.success("Workspace updated", {
                    description: "Your changes are live across the workspace.",
                  })
                }
              >
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="p-6">
            <h3 className="text-base font-semibold">Branding</h3>
            <p className="text-sm text-muted-foreground">
              Customize how Zenkyra looks for your team.
            </p>
            <Separator className="my-5" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <Field label="Primary color">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-md border border-border bg-brand" />
                    <Input defaultValue="#4F7DFF" className="max-w-xs" />
                  </div>
                </Field>
                <Field label="Logo">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-sm font-semibold text-brand">
                      A
                    </span>
                    <Button variant="outline" size="sm">
                      Upload SVG
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                </Field>
                <Field label="Welcome message" hint="Shown to new members on their first login">
                  <Textarea defaultValue="Welcome to Acme's private AI workspace. Ask anything, anytime." />
                </Field>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Preview
                </p>
                <div className="mt-3 rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-md bg-brand" />
                    <p className="text-sm font-semibold">Acme · Zenkyra</p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Welcome to Acme's private AI workspace. Ask anything, anytime.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="divide-y divide-border p-0">
            <NotifRow
              title="Daily activity digest"
              description="Top queries, automations and saved time delivered each morning."
              defaultChecked
            />
            <NotifRow
              title="Document indexing complete"
              description="Get notified when new uploads finish processing."
              defaultChecked
            />
            <NotifRow
              title="Automation failures"
              description="Be the first to know when a workflow needs attention."
              defaultChecked
            />
            <NotifRow
              title="Weekly executive report"
              description="ROI and adoption summary for leadership."
            />
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {integrations.map((i) => (
              <Card key={i.name} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Plug className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.desc}</p>
                    </div>
                  </div>
                  {i.connected && (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </Badge>
                  )}
                </div>
                <div className="mt-5">
                  <Button variant={i.connected ? "outline" : "default"} size="sm" className="w-full">
                    {i.connected ? "Manage" : "Connect"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">API Keys</h3>
                <p className="text-sm text-muted-foreground">
                  Use these to build on top of Zenkyra via REST and webhooks.
                </p>
              </div>
              <Button
                onClick={() =>
                  toast.success("New API key generated", {
                    description: "Make sure to copy it now — it will only be shown once.",
                  })
                }
              >
                <RotateCw className="h-4 w-4" />
                Generate key
              </Button>
            </div>
            <Separator className="my-5" />
            <ul className="divide-y divide-border">
              {[
                { name: "Production", key: "zk_live_8f29…34de", created: "Mar 12, 2026" },
                { name: "Staging", key: "zk_test_2b0d…91af", created: "Feb 03, 2026" },
              ].map((k) => (
                <li key={k.name} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{k.name}</p>
                      <Badge variant="muted">Last used 2h ago</Badge>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{k.key}</p>
                    <p className="text-xs text-muted-foreground">Created {k.created}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard?.writeText(k.key).catch(() => {});
                        toast.success("API key copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        toast.error("API key revoked", {
                          description: `${k.name} key will stop working in 60 seconds.`,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
              <Globe className="h-4 w-4" />
              Webhook endpoint:&nbsp;
              <code className="font-mono text-foreground">https://api.zenkyra.ai/v1/webhooks</code>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function NotifRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
