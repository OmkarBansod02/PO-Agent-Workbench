"use client";

import { useState } from "react";
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
    className: "bg-foreground/5 text-muted border-border/60",
  },
  blocked: {
    label: "Blocked",
    className: "bg-danger/10 text-danger border-danger/20",
  },
};

function CopyPayloadButton({ payload }: { payload: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium rounded border border-border/60 text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy payload
        </>
      )}
    </button>
  );
}

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
          const showCopyPayload =
            action.type === "order_job" && action.status === "prepared";

          return (
            <div
              key={action.id}
              className="border border-border/60 rounded-lg px-3 py-2.5"
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
                <div className="flex items-center gap-1.5 shrink-0">
                  {showCopyPayload && (
                    <CopyPayloadButton payload={action.payload} />
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md border ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
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
