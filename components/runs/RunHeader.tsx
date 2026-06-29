import { StatusBadge } from "../app/StatusBadge";

interface RunHeaderProps {
  customer: string;
  subject: string;
  status: "ready" | "blocked" | "completed" | "needs_review" | "new";
  runId: string;
  startedAt: string;
}

export function RunHeader({ customer, subject, status, runId, startedAt }: RunHeaderProps) {
  return (
    <div className="border border-border rounded-lg bg-surface px-5 py-4 mb-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{customer}</h2>
          <p className="text-sm text-muted mt-0.5">{subject}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted">
        <span>Run: <span className="font-mono">{runId}</span></span>
        <span>Started: {startedAt}</span>
      </div>
    </div>
  );
}
