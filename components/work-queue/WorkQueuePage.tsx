import { PageHeader } from "../app/PageHeader";
import { MetricCard } from "../app/MetricCard";
import { WorkQueueTable } from "./WorkQueueTable";
import { getDemoInboxEmails } from "@/lib/email/demoEmailSource";

export function WorkQueuePage() {
  const emails = getDemoInboxEmails();

  const incoming = emails.length;
  const ready = emails.filter(
    (e) => e.metadata.expectedOutcome === "completed",
  ).length;
  const needsReview = emails.filter(
    (e) => e.metadata.expectedOutcome === "needs_review",
  ).length;
  const blocked = emails.filter(
    (e) => e.metadata.expectedOutcome === "blocked",
  ).length;

  return (
    <div>
      <PageHeader
        title="Work Queue"
        subtitle="Incoming purchase order emails ready for workflow processing"
      />

      <div className="rounded-xl border border-border/80 bg-surface px-4 py-3 mb-5 shadow-sm">
        <div className="text-sm font-medium text-foreground">
          Email → Extract → Validate → Route → Actions → Reply
        </div>
        <p className="text-xs text-muted mt-1">
          Each email becomes a workflow run. Order details are extracted,
          validated against business rules, and routed for processing or human
          review.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <MetricCard label="Incoming" value={incoming} color="accent" />
        <MetricCard label="Ready" value={ready} color="success" />
        <MetricCard label="Needs Review" value={needsReview} color="warning" />
        <MetricCard label="Blocked" value={blocked} color="danger" />
      </div>

      <WorkQueueTable emails={emails} />
    </div>
  );
}
