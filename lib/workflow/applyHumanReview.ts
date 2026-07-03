import type {
  ApprovalGate,
  ExtractedOrder,
  HumanReviewApprovals,
  TraceEvent,
  WorkflowRun,
} from "../domain/types";
import { nowIso } from "../utils/dates";
import { createId } from "../utils/ids";
import { blockersFromValidation } from "./blockers";
import { executeWorkflowActions } from "./executeActions";
import { matchCatalog } from "./matchCatalog";
import { matchCustomer } from "./matchCustomer";
import { calculateRiskScore } from "./riskScore";
import { routeDecision } from "./routeDecision";
import { addTraceEvent } from "./trace";
import { validateOrder } from "./validateOrder";

export interface ApplyHumanReviewInput {
  previousRun: WorkflowRun;
  corrections: Partial<ExtractedOrder>;
  reviewerName: string;
  reviewerNote?: string;
  approvals?: HumanReviewApprovals;
}

const CUSTOMER_MATCH_FIELDS = new Set<keyof ExtractedOrder>([
  "customerId",
  "customerName",
  "requesterEmail",
]);
const CATALOG_MATCH_FIELDS = new Set<keyof ExtractedOrder>([
  "catalogItemId",
  "productName",
]);

function changedCorrectionFields(
  previous: ExtractedOrder,
  corrections: Partial<ExtractedOrder>,
): Array<keyof ExtractedOrder> {
  return (Object.keys(corrections) as Array<keyof ExtractedOrder>).filter(
    (field) => previous[field] !== corrections[field],
  );
}

function updateApprovalGates(
  previousGates: ApprovalGate[],
  approvals: HumanReviewApprovals,
  reviewerName: string,
  decidedAt: string,
): ApprovalGate[] {
  const approvedGates = [
    approvals.rushApproved
      ? { name: "Rush order approval", reason: "The reviewer approved the rush due date." }
      : undefined,
    approvals.artworkChangeApproved
      ? { name: "Artwork change approval", reason: "The reviewer approved the artwork change." }
      : undefined,
    approvals.customerConfirmed
      ? { name: "Customer confirmation", reason: "The reviewer recorded customer confirmation of the extracted details." }
      : undefined,
  ].filter((gate): gate is { name: string; reason: string } => Boolean(gate));

  const nextGates = previousGates.map((gate) => ({ ...gate }));
  for (const approved of approvedGates) {
    const existing = nextGates.find((gate) => gate.name === approved.name);
    if (existing) {
      existing.status = "approved";
      existing.reason = approved.reason;
      existing.decidedAt = decidedAt;
      existing.decidedBy = reviewerName;
    } else {
      nextGates.push({
        id: createId("approval"),
        ...approved,
        status: "approved",
        decidedAt,
        decidedBy: reviewerName,
      });
    }
  }
  return nextGates;
}

function approvalsFromGates(gates: ApprovalGate[]): HumanReviewApprovals {
  return {
    rushApproved: gates.some(
      (gate) => gate.name === "Rush order approval" && gate.status === "approved",
    ),
    artworkChangeApproved: gates.some(
      (gate) =>
        gate.name === "Artwork change approval" && gate.status === "approved",
    ),
    customerConfirmed: gates.some(
      (gate) => gate.name === "Customer confirmation" && gate.status === "approved",
    ),
  };
}

export async function applyHumanReview(
  input: ApplyHumanReviewInput,
): Promise<WorkflowRun> {
  const submittedApprovals = input.approvals ?? {};
  const previousApprovals = approvalsFromGates(input.previousRun.approvalGates);
  const approvals = {
    rushApproved:
      previousApprovals.rushApproved || submittedApprovals.rushApproved,
    artworkChangeApproved:
      previousApprovals.artworkChangeApproved ||
      submittedApprovals.artworkChangeApproved,
    customerConfirmed:
      previousApprovals.customerConfirmed || submittedApprovals.customerConfirmed,
  };
  const correctedFields = changedCorrectionFields(
    input.previousRun.extractedOrder,
    input.corrections,
  );
  const correctedFieldNames = correctedFields.map(String);
  const customerFieldsChanged = correctedFields.some((field) =>
    CUSTOMER_MATCH_FIELDS.has(field),
  );
  const catalogFieldsChanged = correctedFields.some((field) =>
    CATALOG_MATCH_FIELDS.has(field),
  );
  const extractedOrder: ExtractedOrder = {
    ...input.previousRun.extractedOrder,
    ...input.corrections,
  };

  // A changed business key invalidates the old derived match unless the reviewer
  // supplied a replacement ID in the same correction.
  if (
    correctedFields.includes("customerName") &&
    !Object.hasOwn(input.corrections, "customerId")
  ) {
    delete extractedOrder.customerId;
  }
  if (
    correctedFields.includes("productName") &&
    !Object.hasOwn(input.corrections, "catalogItemId")
  ) {
    delete extractedOrder.catalogItemId;
  }

  const traceEvents: TraceEvent[] = input.previousRun.traceEvents.map((event) => ({
    ...event,
    metadata: event.metadata ? { ...event.metadata } : undefined,
  }));
  const reviewedAt = nowIso();
  addTraceEvent(traceEvents, {
    step: "human_review_applied",
    status: "completed",
    title: "Human review applied",
    message: `${input.reviewerName} applied human review to the extracted order.`,
    metadata: {
      reviewerName: input.reviewerName,
      correctedFields: correctedFieldNames,
      reviewerNote: input.reviewerNote,
      approvals: submittedApprovals,
    },
  });

  const customerMatch = matchCustomer({
    customerId: extractedOrder.customerId,
    extractedOrder,
    rawEmail: "",
  });
  if (customerMatch.customer) {
    extractedOrder.customerId = customerMatch.customer.id;
    extractedOrder.customerName ??= customerMatch.customer.name;
  } else {
    delete extractedOrder.customerId;
  }
  if (customerFieldsChanged) {
    addTraceEvent(traceEvents, {
      step: "customer_rematched",
      status: customerMatch.customer ? "completed" : "blocked",
      title: customerMatch.customer ? "Customer re-matched" : "Customer re-match failed",
      message: customerMatch.customer
        ? `${customerMatch.customer.name} was matched after human corrections.`
        : "No configured customer matched the corrected order details.",
      metadata: {
        customerId: customerMatch.customer?.id,
        matchedBy: customerMatch.matchedBy,
      },
    });
  }

  const catalogMatch = matchCatalog(extractedOrder, "");
  if (catalogMatch.catalogItem) {
    extractedOrder.catalogItemId = catalogMatch.catalogItem.id;
    extractedOrder.productName ??= catalogMatch.catalogItem.name;
  } else {
    delete extractedOrder.catalogItemId;
  }
  if (catalogFieldsChanged) {
    addTraceEvent(traceEvents, {
      step: "catalog_rematched",
      status: catalogMatch.catalogItem?.active ? "completed" : "blocked",
      title: catalogMatch.catalogItem
        ? "Catalog item re-matched"
        : "Catalog item re-match failed",
      message: catalogMatch.catalogItem
        ? `${catalogMatch.catalogItem.name} is ${catalogMatch.catalogItem.active ? "active" : "discontinued"} in the local catalog.`
        : "No catalog item matched the corrected product details.",
      metadata: {
        catalogItemId: catalogMatch.catalogItem?.id,
        active: catalogMatch.catalogItem?.active,
        matchedBy: catalogMatch.matchedBy,
      },
    });
  }

  const unresolvedUncertainFields = input.previousRun.uncertainFields.filter(
    (field) => !correctedFieldNames.includes(field),
  );
  const validationIssues = validateOrder({
    extractedOrder,
    intent: input.previousRun.intent,
    customer: customerMatch.customer,
    customerMatchedBy: customerMatch.matchedBy,
    catalogItem: catalogMatch.catalogItem,
    confidence: input.previousRun.aiConfidence,
    uncertainFields: unresolvedUncertainFields,
    approvals,
  });
  const blockers = blockersFromValidation(validationIssues);
  const decision = routeDecision(blockers);
  const riskScore = calculateRiskScore(blockers, input.previousRun.aiConfidence);

  addTraceEvent(traceEvents, {
    step: "validation_recompleted",
    status: decision,
    title: "Deterministic validation re-run",
    message:
      validationIssues.length === 0
        ? "The corrected order passed deterministic validation."
        : `${validationIssues.length} validation issue${validationIssues.length === 1 ? " remains" : "s remain"} after review.`,
    metadata: {
      issueCodes: validationIssues.map(({ code }) => code),
      approvedReviewFlags: Object.entries(approvals)
        .filter(([, approved]) => approved)
        .map(([name]) => name),
      riskScore,
    },
  });
  addTraceEvent(traceEvents, {
    step: "route_redecided",
    status: decision,
    title: "Route re-decided after review",
    message:
      decision === "completed"
        ? "Human review resolved the issues and downstream actions are safe to prepare."
        : decision === "needs_review"
          ? "Review-level issues remain and require another human pass."
          : "Hard blockers remain, so downstream actions are still withheld.",
    metadata: { routeDecision: decision, riskScore },
  });

  const { actions, draftReply } = await executeWorkflowActions({
    runId: input.previousRun.runId,
    emailId: input.previousRun.emailId,
    decision,
    extractedOrder,
    customer: customerMatch.customer,
    validationIssues,
    blockers,
    traceEvents,
  });

  return {
    ...input.previousRun,
    status: decision,
    extractedOrder,
    uncertainFields: unresolvedUncertainFields,
    validationIssues,
    riskScore,
    routeDecision: decision,
    blockers,
    approvalGates: updateApprovalGates(
      input.previousRun.approvalGates,
      submittedApprovals,
      input.reviewerName,
      reviewedAt,
    ),
    actions,
    draftReply,
    draftEmail: draftReply.body,
    traceEvents,
    updatedAt: nowIso(),
  };
}
