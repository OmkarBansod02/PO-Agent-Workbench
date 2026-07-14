import { getCustomerById } from "../domain/mockCustomers";
import type { WorkflowRunStatus } from "../domain/types";
import { getDemoInboxEmails } from "../email/demoEmailSource";
import type { DemoExpectedOutcome } from "../email/types";

export interface DemoWorkflowRunSummary {
  runId: string;
  emailId: string;
  customerName: string;
  subject: string;
  source: "Inbox";
  state: WorkflowRunStatus;
  outcomeSummary: string;
  lastUpdated: string;
  linkTarget: string;
}

const outcomeState: Record<DemoExpectedOutcome, WorkflowRunStatus> = {
  completed: "completed",
  needs_review: "needs_review",
  blocked: "blocked",
};

const outcomeSummaries: Record<DemoExpectedOutcome, string> = {
  completed:
    "Order job prepared, CRM activity logged, confirmation draft ready.",
  needs_review:
    "Routed to human review — missing or uncertain fields require operator input.",
  blocked:
    "Blocked — catalog or data issues prevent automatic job creation.",
};

export function getDemoRunSummaries(): DemoWorkflowRunSummary[] {
  return getDemoInboxEmails().map((email) => {
    const expectedOutcome = email.metadata.expectedOutcome;
    const customer = getCustomerById(email.metadata.customerId);

    return {
      runId: `demo-run-${email.id}`,
      emailId: email.id,
      customerName: customer?.name ?? email.fromName,
      subject: email.subject,
      source: "Inbox",
      state: outcomeState[expectedOutcome],
      outcomeSummary: outcomeSummaries[expectedOutcome],
      lastUpdated: email.receivedAt,
      linkTarget: `/runs/${email.id}`,
    };
  });
}
