import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Headphones,
  Inbox,
  Mail,
  Plus,
  Receipt,
  Save,
  Send,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users2,
  Workflow as WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode, WorkflowConnector } from "@/components/app/workflow-node";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visual automation builder"
        title="Workflows"
        description="Compose what happens when work arrives. Drag triggers, agents and actions — every step runs in your tenant with full audit and approvals."
        meta={
          <>
            <span>14 workflows live</span>
            <span className="hidden md:inline">·</span>
            <span>4,217 runs today</span>
            <span className="hidden md:inline">·</span>
            <span>99.94% success rate</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4" />
              Save draft
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New workflow
            </Button>
          </>
        }
      />

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-dot opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

        <div className="relative space-y-10">
          <WorkflowExample
            title="Lead arrives → Sales Agent → Email → CRM"
            tag="Sales · Active"
            badgeVariant="success"
            description="Triggered the moment an inbound lead lands in HubSpot, your form, or via webhook."
            metric="2,184 runs · 612 hrs saved"
          >
            <WorkflowNode icon={<Inbox />} title="Lead arrives" subtitle="Webhook · HubSpot · Form" tone="brand" index={0} />
            <WorkflowConnector />
            <WorkflowNode
              icon={<Bot />}
              title="Sales Agent"
              subtitle="Score · Personalize · Draft"
              tone="brand"
              index={1}
              accent
            />
            <WorkflowConnector />
            <WorkflowNode icon={<Mail />} title="Email" subtitle="Auto-send · in your voice" tone="success" index={2} />
            <WorkflowConnector />
            <WorkflowNode icon={<Building2 />} title="CRM" subtitle="Update · Salesforce / HubSpot" tone="muted" index={3} />
          </WorkflowExample>

          <WorkflowExample
            title="Invoice uploaded → Finance Agent → Process"
            tag="Finance · Active"
            badgeVariant="success"
            description="Reads incoming invoices, validates against POs and routes for the right approver."
            metric="612 runs · 274 hrs saved"
          >
            <WorkflowNode icon={<Receipt />} title="Invoice uploaded" subtitle="Email · Drive · Drop" tone="brand" index={0} />
            <WorkflowConnector />
            <WorkflowNode
              icon={<Bot />}
              title="Finance Agent"
              subtitle="OCR · Match PO · Validate"
              tone="warning"
              index={1}
              accent
            />
            <WorkflowConnector />
            <WorkflowNode icon={<UserCheck />} title="Approval" subtitle="Manager · 2-step rule" tone="brand" index={2} />
            <WorkflowConnector />
            <WorkflowNode icon={<CheckCircle2 />} title="Process" subtitle="Post to ERP · Reconcile" tone="success" index={3} />
          </WorkflowExample>

          <WorkflowExample
            title="Ticket arrives → Support Agent → Resolve"
            tag="Support · Active"
            badgeVariant="success"
            description="Triages every incoming ticket, drafts a grounded answer and escalates only what truly needs a human."
            metric="9,420 runs · 1,184 hrs saved"
          >
            <WorkflowNode icon={<Headphones />} title="Ticket arrives" subtitle="Zendesk · Inbox · Chat" tone="brand" index={0} />
            <WorkflowConnector />
            <WorkflowNode
              icon={<Bot />}
              title="Support Agent"
              subtitle="Classify · Sentiment · Draft"
              tone="success"
              index={1}
              accent
            />
            <WorkflowConnector />
            <WorkflowNode icon={<AlertTriangle />} title="Escalate" subtitle="If sentiment < 0.3" tone="warning" index={2} />
            <WorkflowConnector />
            <WorkflowNode icon={<Send />} title="Resolve" subtitle="Auto-reply · Close" tone="success" index={3} />
          </WorkflowExample>

          <WorkflowExample
            title="Internal request → Ops Agent → Done"
            tag="Ops · Active"
            badgeVariant="success"
            description="A teammate asks a question or files an internal request. The Ops Agent runs the SOP end-to-end."
            metric="2,104 runs · 318 hrs saved"
          >
            <WorkflowNode icon={<Users2 />} title="Request" subtitle="Slack · Teams · Form" tone="brand" index={0} />
            <WorkflowConnector />
            <WorkflowNode
              icon={<Bot />}
              title="Ops Agent"
              subtitle="Match SOP · Run · Notify"
              tone="warning"
              index={1}
              accent
            />
            <WorkflowConnector />
            <WorkflowNode icon={<FileText />} title="Run SOP" subtitle="7-step playbook" tone="brand" index={2} />
            <WorkflowConnector />
            <WorkflowNode icon={<CheckCircle2 />} title="Notify" subtitle="Reply with proof" tone="success" index={3} />
          </WorkflowExample>

          <WorkflowExample
            title="Weekly review → Executive Analyst → Briefing"
            tag="Analyst · Training"
            badgeVariant="muted"
            description="Every Monday, the Executive Analyst drafts a board-ready briefing with anomalies, trends and next-action recommendations."
            metric="312 runs · 96 hrs saved"
          >
            <WorkflowNode icon={<TrendingUp />} title="Weekly trigger" subtitle="Mon 07:00 UTC" tone="brand" index={0} />
            <WorkflowConnector />
            <WorkflowNode
              icon={<Bot />}
              title="Executive Analyst"
              subtitle="Detect · Explain · Draft"
              tone="muted"
              index={1}
              accent
            />
            <WorkflowConnector />
            <WorkflowNode icon={<CircleDollarSign />} title="ROI rollup" subtitle="Cross-functional" tone="brand" index={2} />
            <WorkflowConnector />
            <WorkflowNode icon={<Send />} title="Briefing" subtitle="Slack · Email · PDF" tone="success" index={3} />
          </WorkflowExample>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">Compose your own workflow</h3>
              <p className="text-sm text-muted-foreground">
                Start from a template or drag triggers, agents and actions onto a canvas. Every connection is auditable.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/agents">
                Browse agents
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button>
              <WorkflowIcon className="h-4 w-4" />
              Open builder
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function WorkflowExample({
  title,
  tag,
  description,
  badgeVariant,
  metric,
  children,
}: {
  title: string;
  tag: string;
  description: string;
  badgeVariant: "success" | "warning" | "muted";
  metric?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{title}</h3>
            <Badge variant={badgeVariant}>{tag}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {metric && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {metric}
          </span>
        )}
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-nowrap items-center gap-1.5">{children}</div>
      </div>
    </div>
  );
}
