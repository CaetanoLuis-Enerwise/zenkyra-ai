import {
  Mail,
  Phone,
  CheckCircle2,
  CircleDot,
  Tag,
  Reply,
  AlertTriangle,
  Sparkles,
  Plus,
  Save,
  Play,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode, WorkflowConnector } from "@/components/app/workflow-node";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Compose multi-step AI workflows with branching, approvals and human-in-the-loop steps."
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
            title="Lead received → qualify → outreach"
            tag="Sales · Active"
            badgeVariant="success"
            description="Triggered when a new lead is created in HubSpot or via webhook."
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <WorkflowNode icon={<Mail />} title="Lead received" subtitle="Trigger · Webhook" tone="brand" index={0} />
              <WorkflowConnector />
              <WorkflowNode icon={<CircleDot />} title="Qualify" subtitle="AI · Score 0-100" tone="warning" index={1} />
              <WorkflowConnector />
              <WorkflowNode icon={<Reply />} title="Send email" subtitle="AI drafts · Auto-send" tone="brand" index={2} />
              <WorkflowConnector />
              <WorkflowNode icon={<Phone />} title="Schedule call" subtitle="If score ≥ 70" tone="success" index={3} />
            </div>
          </WorkflowExample>

          <WorkflowExample
            title="Ticket received → triage → resolve"
            tag="Support · Active"
            badgeVariant="success"
            description="Routes incoming tickets to the right agent and proposes grounded answers."
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <WorkflowNode icon={<Mail />} title="Ticket received" subtitle="Zendesk · Inbox" tone="brand" index={0} />
              <WorkflowConnector />
              <WorkflowNode icon={<Tag />} title="Categorize" subtitle="AI · 12 categories" tone="warning" index={1} />
              <WorkflowConnector />
              <WorkflowNode icon={<Sparkles />} title="Suggest answer" subtitle="Grounded on SOPs" tone="brand" index={2} />
              <WorkflowConnector />
              <WorkflowNode icon={<AlertTriangle />} title="Escalate" subtitle="If sentiment < 0.3" tone="warning" index={3} />
              <WorkflowConnector />
              <WorkflowNode icon={<CheckCircle2 />} title="Resolve" subtitle="Auto-close" tone="success" index={4} />
            </div>
          </WorkflowExample>

          <WorkflowExample
            title="Invoice received → validate → approve"
            tag="Finance · Draft"
            badgeVariant="muted"
            description="Reads incoming invoices, validates against POs and routes for approval."
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <WorkflowNode icon={<Mail />} title="Invoice received" subtitle="Email · PDF" tone="brand" index={0} />
              <WorkflowConnector />
              <WorkflowNode icon={<Sparkles />} title="Extract fields" subtitle="AI · OCR + parse" tone="warning" index={1} />
              <WorkflowConnector />
              <WorkflowNode icon={<CheckCircle2 />} title="Match PO" subtitle="ERP lookup" tone="brand" index={2} />
              <WorkflowConnector />
              <WorkflowNode icon={<Reply />} title="Approval" subtitle="Manager review" tone="muted" index={3} />
            </div>
          </WorkflowExample>
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
  children,
}: {
  title: string;
  tag: string;
  description: string;
  badgeVariant: "success" | "warning" | "muted";
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
        <Button variant="ghost" size="sm">
          <Play className="h-4 w-4" />
          Test run
        </Button>
      </div>
      <div className="overflow-x-auto pb-2">{children}</div>
    </div>
  );
}
