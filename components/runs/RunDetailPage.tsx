import Link from "next/link";
import type { WorkflowRun } from "@/lib/domain/types";
import type { InboxEmail } from "@/lib/email/types";
import { RunHeader } from "./RunHeader";
import { RunSectionCard } from "./RunSectionCard";
import { AIExtractionCard } from "./AIExtractionCard";
import { ExtractedOrderCard } from "./ExtractedOrderCard";
import { ValidationBlockersCard } from "./ValidationBlockersCard";
import { RouteDecisionCard } from "./RouteDecisionCard";
import { AuditTrace } from "./AuditTrace";

interface RunDetailPageProps {
  email: InboxEmail;
  workflowRun: WorkflowRun;
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

export function RunDetailPage({ email, workflowRun }: RunDetailPageProps) {
  return (
    <div>
      <RunHeader
        customer={
          workflowRun.extractedOrder.customerName ?? email.fromName
        }
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

export function RunDetailNotFound({ emailId }: { emailId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="border border-border rounded-lg bg-surface px-8 py-10 text-center max-w-md">
        <h2 className="text-base font-semibold text-foreground mb-2">
          Email not found
        </h2>
        <p className="text-sm text-muted mb-6">
          No inbox email matches the id{" "}
          <span className="font-mono text-xs">{emailId}</span>.
        </p>
        <Link
          href="/work-queue"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
        >
          Back to Work Queue
        </Link>
      </div>
    </div>
  );
}
