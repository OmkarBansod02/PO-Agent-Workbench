import type { WorkflowAction, WorkflowActionStatus, WorkflowActionType } from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface ActionsCardProps {
  actions: WorkflowAction[];
}

const typeIcons: Record<WorkflowActionType, string> = {
  order_job: "📦",
  crm_activity: "📋",
  review_task: "👁",
  reply_draft: "✉️",
};

const statusBadge: Record<
  WorkflowActionStatus,
  { label: string; className: string }
> = {
  prepared: {
    label: "Prepared",
    className: "bg-success/10 text-success border-success/20",
  },
  skipped: {
    label: "Skipped",
    className: "bg-foreground/5 text-muted border-border",
  },
  blocked: {
    label: "Blocked",
    className: "bg-danger/10 text-danger border-danger/20",
  },
};

function PayloadFields({ payload }: { payload: Record<string, unknown> }) {
  const displayKeys = Object.entries(payload).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      key !== "draftOnly" &&
      key !== "autoSend" &&
      key !== "body" &&
      key !== "tone",
  );

  if (displayKeys.length === 0) return null;

  return (
    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
      {displayKeys.slice(0, 6).map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="text-xs text-muted truncate">{formatKey(key)}</dt>
          <dd className="text-xs text-foreground/80 truncate">
            {formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return JSON.stringify(value);
}

export function ActionsCard({ actions }: ActionsCardProps) {
  if (actions.length === 0) {
    return (
      <RunSectionCard title="Downstream Actions">
        <p className="text-sm text-muted py-2 text-center">
          No actions executed for this run.
        </p>
      </RunSectionCard>
    );
  }

  return (
    <RunSectionCard title="Downstream Actions">
      <div className="space-y-3">
        {actions.map((action) => {
          const badge = statusBadge[action.status];
          return (
            <div
              key={action.id}
              className="border border-border rounded-md px-3 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none shrink-0">
                    {typeIcons[action.type]}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {action.title}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded border shrink-0 ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
                {action.summary}
              </p>
              <PayloadFields payload={action.payload} />
            </div>
          );
        })}
      </div>
    </RunSectionCard>
  );
}
