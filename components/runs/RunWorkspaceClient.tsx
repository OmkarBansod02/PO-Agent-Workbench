"use client";

import { useState } from "react";
import type { WorkflowRun } from "@/lib/domain/types";
import type { InboxEmail } from "@/lib/email/types";
import { RunHeader } from "./RunHeader";
import { AIExtractionCard } from "./AIExtractionCard";
import { ExtractedOrderCard } from "./ExtractedOrderCard";
import { ValidationBlockersCard } from "./ValidationBlockersCard";
import { RouteDecisionCard } from "./RouteDecisionCard";
import { HumanReviewPanel } from "./HumanReviewPanel";
import { ActionsCard } from "./ActionsCard";
import { DraftReplyCard } from "./DraftReplyCard";
import { RunSectionCard } from "./RunSectionCard";
import { AuditTrace } from "./AuditTrace";

interface RunWorkspaceClientProps {
  email: InboxEmail;
  initialWorkflowRun: WorkflowRun;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function extractionSummary(run: WorkflowRun): string | undefined {
  const extractionTrace = run.traceEvents.find(
    (e) => e.step === "order_extracted",
  );
  return extractionTrace?.outputSummary ?? undefined;
}

function isReviewable(run: WorkflowRun): boolean {
  return run.status === "needs_review" || run.status === "blocked";
}

export function RunWorkspaceClient({
  email,
  initialWorkflowRun,
}: RunWorkspaceClientProps) {
  const [workflowRun, setWorkflowRun] =
    useState<WorkflowRun>(initialWorkflowRun);

  function handleReviewApplied(updatedRun: WorkflowRun) {
    setWorkflowRun(updatedRun);
  }

  return (
    <div>
      <RunHeader
        customer={workflowRun.extractedOrder.customerName ?? email.fromName}
        subject={email.subject}
        status={workflowRun.status}
        source={email.source}
        emailId={email.id}
        receivedAt={formatDateTime(email.receivedAt)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIExtractionCard
          method={workflowRun.extractionMethod}
          model={workflowRun.aiModel}
          confidence={workflowRun.aiConfidence}
          uncertainFields={workflowRun.uncertainFields}
          extractionSummary={extractionSummary(workflowRun)}
        />

        <RouteDecisionCard
          decision={workflowRun.routeDecision}
          riskScore={workflowRun.riskScore}
        />

        <ExtractedOrderCard order={workflowRun.extractedOrder} />

        <ValidationBlockersCard
          validationIssues={workflowRun.validationIssues}
          blockers={workflowRun.blockers}
        />

        {isReviewable(workflowRun) && (
          <div className="lg:col-span-2">
            <HumanReviewPanel
              workflowRun={workflowRun}
              onReviewApplied={handleReviewApplied}
            />
          </div>
        )}

        <ActionsCard actions={workflowRun.actions} />

        {workflowRun.draftReply && (
          <DraftReplyCard draftReply={workflowRun.draftReply} />
        )}

        <RunSectionCard title="Original Email">
          <div className="space-y-2 text-foreground/80">
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>
                From: {email.fromName} &lt;{email.fromEmail}&gt;
              </span>
            </div>
            <div className="text-xs text-muted">Subject: {email.subject}</div>
            <pre className="mt-3 whitespace-pre-wrap leading-relaxed text-sm font-sans text-foreground/80">
              {email.bodyText}
            </pre>
          </div>
        </RunSectionCard>

        <AuditTrace traceEvents={workflowRun.traceEvents} />
      </div>
    </div>
  );
}
