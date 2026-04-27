import { PageHeader } from "@/components/layout/page-header";
import { TeamTable } from "@/components/app/team-table";
import { InviteDialog } from "@/components/app/invite-dialog";
import { api } from "@/lib/api";

export default async function TeamPage() {
  const members = await api.team();

  const roleCount = members.reduce<Record<string, number>>((acc, m) => {
    acc[m.role] = (acc[m.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Manage members, roles and access across your Zenkyra workspace."
        actions={<InviteDialog />}
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Pill label="Total members" value={String(members.length)} />
        <Pill label="Admins" value={String(roleCount.Admin ?? 0)} />
        <Pill label="Managers" value={String(roleCount.Manager ?? 0)} />
        <Pill
          label="Active now"
          value={String(members.filter((m) => m.lastActive === "Active now").length)}
          highlight
        />
      </section>

      <TeamTable members={members} />
    </div>
  );
}

function Pill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-lg border border-brand/30 bg-brand/5 px-4 py-3"
          : "rounded-lg border border-border bg-card px-4 py-3"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
