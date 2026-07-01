import { extractPurchaseOrder } from "../ai/extractPurchaseOrder";
import type {
  ExtractedOrder,
  PurchaseOrderIntent,
  TraceEvent,
  ValidationIssue,
  WorkflowRun,
} from "../domain/types";
import { createId } from "../utils/ids";
import { nowIso } from "../utils/dates";
import { blockersFromValidation, createBlocker } from "./blockers";
import { matchCatalog } from "./matchCatalog";
import { matchCustomer } from "./matchCustomer";
import { calculateRiskScore } from "./riskScore";
import { routeDecision } from "./routeDecision";
import { addTraceEvent } from "./trace";
import { validateOrder } from "./validateOrder";

export interface RunPOWorkflowInput {
  emailId: string;
  rawEmail: string;
  source: "demo" | "agentmail";
  customerId?: string;
}

export async function runPOWorkflow(
  input: RunPOWorkflowInput,
): Promise<WorkflowRun> {
  const runId = createId("run");
  const createdAt = nowIso();
  const traceEvents: TraceEvent[] = [];
  let intent: PurchaseOrderIntent = "unclear";
  let extractedOrder: ExtractedOrder = {};

  addTraceEvent(traceEvents, {
    step: "email_received",
    status: "completed",
    title: "Email received",
    message: "The inbox email was accepted for purchase order processing.",
    metadata: { emailId: input.emailId, source: input.source },
  });

  try {
    addTraceEvent(traceEvents, {
      step: "ai_extraction_started",
      status: "running",
      title: "AI extraction started",
      message: "Structured extraction started with a deterministic fallback available.",
    });

    const extraction = await extractPurchaseOrder({ rawEmail: input.rawEmail });
    intent = extraction.intent;
    extractedOrder = extraction.extractedOrder;

    addTraceEvent(traceEvents, {
      step: "order_extracted",
      status: "completed",
      title: "Order extracted",
      message:
        extraction.method === "ai"
          ? "The email was extracted with the configured AI model."
          : "The email was extracted with the deterministic fallback.",
      outputSummary: extraction.extractionSummary,
      metadata: {
        method: extraction.method,
        model: extraction.model,
        confidence: extraction.confidence,
        uncertainFields: extraction.uncertainFields,
        fallbackReason: extraction.fallbackReason,
      },
    });

    const customerMatch = matchCustomer({
      customerId: input.customerId,
      extractedOrder,
      rawEmail: input.rawEmail,
    });
    let defaultShippingApplied = false;
    if (customerMatch.customer) {
      extractedOrder.customerId = customerMatch.customer.id;
      extractedOrder.customerName ??= customerMatch.customer.name;
      if (!extractedOrder.shippingLocation) {
        extractedOrder.shippingLocation =
          customerMatch.customer.defaultShippingLocation;
        defaultShippingApplied = true;
      }
    }
    addTraceEvent(traceEvents, {
      step: "customer_matched",
      status: customerMatch.customer ? "completed" : "blocked",
      title: customerMatch.customer ? "Customer matched" : "Customer not matched",
      message: customerMatch.customer
        ? customerMatch.matchedBy === "customer_id"
          ? `${customerMatch.customer.name} matched from inbox metadata.`
          : `${customerMatch.customer.name} matched through local customer configuration.`
        : "No safe customer match was found in local configuration.",
      metadata: {
        customerId: customerMatch.customer?.id,
        matchedBy: customerMatch.matchedBy,
        defaultShippingApplied,
      },
    });

    const catalogMatch = matchCatalog(extractedOrder, input.rawEmail);
    if (catalogMatch.catalogItem) {
      extractedOrder.catalogItemId = catalogMatch.catalogItem.id;
      extractedOrder.productName ??= catalogMatch.catalogItem.name;
    }
    addTraceEvent(traceEvents, {
      step: "catalog_checked",
      status: catalogMatch.catalogItem?.active ? "completed" : "blocked",
      title: catalogMatch.catalogItem
        ? "Catalog item checked"
        : "Catalog item not matched",
      message: catalogMatch.catalogItem
        ? `${catalogMatch.catalogItem.name} is ${catalogMatch.catalogItem.active ? "active" : "discontinued"} in the local catalog.`
        : "No safe catalog match was found.",
      metadata: {
        catalogItemId: catalogMatch.catalogItem?.id,
        sku: catalogMatch.catalogItem?.sku,
        active: catalogMatch.catalogItem?.active,
        matchedBy: catalogMatch.matchedBy,
      },
    });

    const validationIssues = validateOrder({
      extractedOrder,
      intent,
      customer: customerMatch.customer,
      customerMatchedBy: customerMatch.matchedBy,
      catalogItem: catalogMatch.catalogItem,
      confidence: extraction.confidence,
      uncertainFields: extraction.uncertainFields,
    });
    const blockers = blockersFromValidation(validationIssues);
    const decision = routeDecision(blockers);
    const riskScore = calculateRiskScore(blockers, extraction.confidence);

    addTraceEvent(traceEvents, {
      step: "validation_completed",
      status: decision,
      title: "Deterministic validation completed",
      message:
        validationIssues.length === 0
          ? "Customer, catalog, and business rule checks passed."
          : `${validationIssues.length} validation issue${validationIssues.length === 1 ? " was" : "s were"} found.`,
      metadata: {
        issueCodes: validationIssues.map(({ code }) => code),
        warningIssueCount: validationIssues.filter(
          ({ severity }) => severity === "warning",
        ).length,
        blockingIssueCount: blockers.filter(({ blocksProgress }) => blocksProgress)
          .length,
        reviewIssueCount: blockers.filter(({ blocksProgress }) => !blocksProgress)
          .length,
        riskScore,
      },
    });
    addTraceEvent(traceEvents, {
      step: "route_decided",
      status: decision,
      title: "Route decided",
      message:
        decision === "completed"
          ? "The intake is clean enough for downstream actions in a later phase."
          : decision === "needs_review"
            ? "The intake is held for safe human review."
            : "Required or unsafe order data blocks downstream processing.",
      metadata: { routeDecision: decision, riskScore },
    });

    return {
      runId,
      definitionId: "po-intake",
      emailId: input.emailId,
      source: input.source,
      status: decision,
      intent,
      extractedOrder,
      extractionMethod: extraction.method,
      aiModel: extraction.model,
      aiConfidence: extraction.confidence,
      uncertainFields: extraction.uncertainFields,
      validationIssues,
      riskScore,
      routeDecision: decision,
      blockers,
      approvalGates: [],
      actions: [],
      traceEvents,
      createdAt,
      updatedAt: nowIso(),
    };
  } catch {
    const validationIssues: ValidationIssue[] = [
      {
        id: createId("validation"),
        code: "INTERNAL_WORKFLOW_ERROR",
        message: "The workflow encountered an internal error and stopped safely.",
        severity: "error",
      },
    ];
    const blockers = [
      createBlocker({
        code: "INTERNAL_WORKFLOW_ERROR",
        title: "Internal workflow error",
        message: "The workflow stopped safely. No downstream action was attempted.",
        severity: "error",
        blocksProgress: true,
      }),
    ];
    addTraceEvent(traceEvents, {
      step: "route_decided",
      status: "failed",
      title: "Workflow failed safely",
      message: "An unrecoverable internal error stopped the workflow.",
      metadata: { routeDecision: "blocked" },
    });

    return {
      runId,
      definitionId: "po-intake",
      emailId: input.emailId,
      source: input.source,
      status: "failed",
      intent,
      extractedOrder,
      extractionMethod: "fallback",
      aiConfidence: 0,
      uncertainFields: [],
      validationIssues,
      riskScore: 100,
      routeDecision: "blocked",
      blockers,
      approvalGates: [],
      actions: [],
      traceEvents,
      createdAt,
      updatedAt: nowIso(),
    };
  }
}
