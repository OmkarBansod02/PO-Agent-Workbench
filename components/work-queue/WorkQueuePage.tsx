import { PageHeader } from "../app/PageHeader";
import { MetricCard } from "../app/MetricCard";
import { WorkQueueTable } from "./WorkQueueTable";
import { getDemoInboxEmails } from "@/lib/email/demoEmailSource";

export function WorkQueuePage() {
  const emails = getDemoInboxEmails();

  const newCount = emails.filter((e) => e.status === "new").length;
  const queuedCount = emails.filter((e) => e.status === "queued" || e.status === "processing").length;
  const blockedCount = emails.filter((e) => e.status === "blocked").length;
  const processedCount = emails.filter((e) => e.status === "processed").length;

  return (
    <div>
      <PageHeader
        title="Work Queue"
        subtitle="Incoming purchase order emails ready for workflow processing"
      />

      <div className="border border-border rounded-lg bg-surface px-4 py-3 mb-5">
        <div className="text-sm font-medium text-foreground">
          Email → Order System → CRM → Customer Reply
        </div>
        <p className="text-xs text-muted mt-1">
          Extracts order details, validates business rules, prepares downstream actions, and escalates blockers.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <MetricCard label="New" value={newCount} color="accent" />
        <MetricCard label="In Progress" value={queuedCount} color="success" />
        <MetricCard label="Blocked" value={blockedCount} color="danger" />
        <MetricCard label="Processed" value={processedCount} />
      </div>

      <WorkQueueTable />
    </div>
  );
}
