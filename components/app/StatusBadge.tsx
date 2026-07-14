export type Status =
  | "new"
  | "queued"
  | "processing"
  | "processed"
  | "blocked"
  | "ready"
  | "running"
  | "completed"
  | "needs_review"
  | "failed";

const statusStyles: Record<Status, string> = {
  new: "bg-accent/10 text-accent",
  queued: "bg-accent/10 text-accent",
  processing: "bg-warning/10 text-warning",
  processed: "bg-success/10 text-success",
  ready: "bg-success/10 text-success",
  running: "bg-accent/10 text-accent",
  blocked: "bg-danger/10 text-danger",
  completed: "bg-success/10 text-success",
  needs_review: "bg-warning/10 text-warning",
  failed: "bg-danger/10 text-danger",
};

const statusLabels: Record<Status, string> = {
  new: "New",
  queued: "Queued",
  processing: "Processing",
  processed: "Processed",
  ready: "Ready",
  running: "Running",
  blocked: "Blocked",
  completed: "Completed",
  needs_review: "Needs Review",
  failed: "Failed",
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
