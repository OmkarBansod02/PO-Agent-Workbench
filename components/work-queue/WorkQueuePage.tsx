import { PageHeader } from "../app/PageHeader";
import { MetricCard } from "../app/MetricCard";
import { WorkQueueTable } from "./WorkQueueTable";

export function WorkQueuePage() {
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
        <MetricCard label="New" value={3} color="accent" />
        <MetricCard label="Ready" value={1} color="success" />
        <MetricCard label="Blocked" value={1} color="danger" />
        <MetricCard label="Completed today" value={0} />
      </div>

      <WorkQueueTable />
    </div>
  );
}
