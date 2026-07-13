import { getCustomerById } from "../domain/mockCustomers";
import type { WorkflowRunStatus } from "../domain/types";
import { getDemoInboxEmails } from "../email/demoEmailSource";
import type { DemoExpectedOutcome } from "../email/types";

export interface DemoWorkflowRunSummary {
  runId: string;
  emailId: string;
  customerName: string;
  subject: string;
  source: "Demo Inbox";
  state: WorkflowRunStatus;
  stateLabel: string;
  outcomeSummary: string;
  lastUpdated: string;
  linkTarget: string;
}

const outcomeState: Record<DemoExpectedOutcome, WorkflowRunStatus> = {
  completed: "completed",
  needs_review: "needs_review",
  blocked: "blocked",
};

const stateLabels: Record<DemoExpectedOutcome, string> = {
  completed: "Expected completed",
  needs_review: "Expected needs review",
  blocked: "Expected blocked",
};

const outcomeSummaries: Record<DemoExpectedOutcome, string> = {
  completed:
    "Clean order should prepare a mock order-system job, CRM activity, and confirmation draft.",
  needs_review:
    "Missing, uncertain, or risky details should create a human review task before downstream actions.",
  blocked:
    "Unsafe catalog or required-data issues should block job creation and prepare a clarification draft.",
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
      source: "Demo Inbox",
      state: outcomeState[expectedOutcome],
      stateLabel: stateLabels[expectedOutcome],
      outcomeSummary: outcomeSummaries[expectedOutcome],
      lastUpdated: email.receivedAt,
      linkTarget: `/runs/${email.id}`,
    };
  });
}
