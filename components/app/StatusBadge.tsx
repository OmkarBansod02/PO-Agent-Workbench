export type Status =
  | "new"
  | "queued"
  | "processing"
  | "processed"
  | "blocked"
  | "ready"
  | "completed"
  | "needs_review";

const statusStyles: Record<Status, string> = {
  new: "bg-accent/10 text-accent",
  queued: "bg-accent/10 text-accent",
  processing: "bg-warning/10 text-warning",
  processed: "bg-success/10 text-success",
  ready: "bg-success/10 text-success",
  blocked: "bg-danger/10 text-danger",
  completed: "bg-foreground/8 text-foreground/70",
  needs_review: "bg-warning/10 text-warning",
};

const statusLabels: Record<Status, string> = {
  new: "New",
  queued: "Queued",
  processing: "Processing",
  processed: "Processed",
  ready: "Ready",
  blocked: "Blocked",
  completed: "Completed",
  needs_review: "Needs review",
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
