import type { TraceEvent } from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface AuditTraceProps {
  traceEvents: TraceEvent[];
}

function stepStatusDot(status: string): string {
  switch (status) {
    case "completed":
      return "bg-success";
    case "running":
      return "bg-accent";
    case "blocked":
    case "failed":
      return "bg-danger";
    case "needs_review":
      return "bg-warning";
    default:
      return "bg-foreground/30";
  }
}

function formatTraceTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function AuditTrace({ traceEvents }: AuditTraceProps) {
  if (traceEvents.length === 0) {
    return (
      <RunSectionCard title="Audit Trace">
        <p className="text-sm text-muted py-4 text-center">
          No trace events recorded.
        </p>
      </RunSectionCard>
    );
  }

  return (
    <RunSectionCard title="Audit Trace">
      <ol className="relative border-l border-border/60 ml-2">
        {traceEvents.map((event, idx) => (
          <li
            key={event.id}
            className={`pl-5 ${idx < traceEvents.length - 1 ? "pb-4" : ""} relative`}
          >
            <span
              className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-surface ${stepStatusDot(event.status)}`}
            />
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                {event.title}
              </span>
              <span className="text-xs text-muted tabular-nums shrink-0">
                {formatTraceTimestamp(event.timestamp)}
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">
              {event.message}
            </p>
          </li>
        ))}
      </ol>
    </RunSectionCard>
  );
}
