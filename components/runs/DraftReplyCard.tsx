import type { ReplyDraft, ReplyDraftType, ExtractionMethod } from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface DraftReplyCardProps {
  draftReply: ReplyDraft;
}

const draftTypeLabels: Record<ReplyDraftType, { label: string; className: string }> = {
  confirmation: {
    label: "Confirmation",
    className: "bg-success/10 text-success border-success/20",
  },
  clarification: {
    label: "Clarification",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  review_required: {
    label: "Review Required",
    className: "bg-danger/10 text-danger border-danger/20",
  },
};

const methodLabels: Record<ExtractionMethod, string> = {
  ai: "AI-generated",
  fallback: "Template-based",
};

export function DraftReplyCard({ draftReply }: DraftReplyCardProps) {
  const typeConfig = draftTypeLabels[draftReply.draftType];

  return (
    <RunSectionCard title="Customer Reply Draft">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded border ${typeConfig.className}`}
            >
              {typeConfig.label}
            </span>
            <span className="text-xs text-muted">
              {methodLabels[draftReply.method]}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border border-border bg-foreground/5 text-muted">
            Draft only — not sent
          </span>
        </div>

        <div className="border border-border rounded-md bg-background">
          <div className="px-3 py-2 border-b border-border">
            <span className="text-xs text-muted">Subject:</span>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {draftReply.subject}
            </p>
          </div>
          <div className="px-3 py-3">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground/80">
              {draftReply.body}
            </pre>
          </div>
        </div>
      </div>
    </RunSectionCard>
  );
}
