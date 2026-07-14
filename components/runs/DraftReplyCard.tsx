"use client";

import { useState } from "react";
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border/60 bg-surface text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy draft
        </>
      )}
    </button>
  );
}

export function DraftReplyCard({ draftReply }: DraftReplyCardProps) {
  const typeConfig = draftTypeLabels[draftReply.draftType];
  const fullDraft = `Subject: ${draftReply.subject}\n\n${draftReply.body}`;

  return (
    <RunSectionCard title="Customer Reply Draft">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md border ${typeConfig.className}`}
            >
              {typeConfig.label}
            </span>
            <span className="text-xs text-muted">
              {methodLabels[draftReply.method]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={fullDraft} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border border-border/60 bg-foreground/[0.03] text-muted">
              Draft only — not sent
            </span>
          </div>
        </div>

        <div className="border border-border/60 rounded-lg bg-background/40">
          <div className="px-3 py-2 border-b border-border/40">
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
