import { mockRules } from "../domain/mockRules";
import type {
  CatalogItem,
  Customer,
  ExtractedOrder,
  PurchaseOrderIntent,
  ValidationIssue,
} from "../domain/types";
import { createId } from "../utils/ids";

export interface ValidateOrderInput {
  extractedOrder: ExtractedOrder;
  intent: PurchaseOrderIntent;
  customer?: Customer;
  customerMatchedBy?: "customer_id" | "name" | "email_domain";
  catalogItem?: CatalogItem;
  confidence: number;
  uncertainFields: string[];
  referenceDate?: Date;
}

function issue(
  code: string,
  message: string,
  severity: ValidationIssue["severity"],
  field?: keyof ExtractedOrder,
): ValidationIssue {
  return { id: createId("validation"), code, message, severity, field };
}

function daysUntil(date: string, referenceDate: Date): number | undefined {
  const dueDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(dueDate.getTime())) return undefined;
  const start = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );
  return Math.ceil((dueDate.getTime() - start) / 86_400_000);
}

export function validateOrder(input: ValidateOrderInput): ValidationIssue[] {
  const { extractedOrder: order, customer, catalogItem } = input;
  const issues: ValidationIssue[] = [];

  if (!order.poNumber) {
    issues.push(issue("MISSING_PO_NUMBER", "A purchase order number is required.", "error", "poNumber"));
  }
  if (!order.quantity) {
    issues.push(issue("MISSING_QUANTITY", "A single confirmed quantity is required.", "error", "quantity"));
  }
  if (!order.productName) {
    issues.push(issue("MISSING_PRODUCT", "A product is required.", "error", "productName"));
  }
  if (!order.dueDate) {
    issues.push(issue("MISSING_DUE_DATE", "A due date is required.", "error", "dueDate"));
  }
  if (!customer) {
    issues.push(issue("UNKNOWN_CUSTOMER", "The customer could not be matched to local configuration.", "error", "customerId"));
  } else if (!customer.active) {
    issues.push(issue("INACTIVE_CUSTOMER", "The matched customer is inactive.", "error", "customerId"));
  } else if (
    input.customerMatchedBy !== "customer_id" &&
    order.customerName &&
    order.customerName.toLowerCase() !== customer.name.toLowerCase()
  ) {
    issues.push(
      issue(
        "CUSTOMER_IDENTITY_CONFLICT",
        "The extracted customer name conflicts with the matched customer configuration.",
        "error",
        "customerName",
      ),
    );
  }
  if (order.productName && !catalogItem) {
    issues.push(issue("UNKNOWN_CATALOG_ITEM", "The requested product is not in the local catalog.", "error", "catalogItemId"));
  }
  if (catalogItem && !catalogItem.active) {
    issues.push(
      issue(
        "DISCONTINUED_CATALOG_ITEM",
        catalogItem.discontinuedReason ?? "The requested catalog item is discontinued.",
        "error",
        "catalogItemId",
      ),
    );
  }
  if (catalogItem?.requiresArtwork && !order.artworkReference) {
    issues.push(issue("MISSING_ARTWORK_REFERENCE", "Artwork is required for this decorated product.", "error", "artworkReference"));
  }
  if (!order.shippingLocation) {
    issues.push(issue("MISSING_SHIPPING_LOCATION", "A shipping location is required.", "error", "shippingLocation"));
  }

  if (order.dueDate) {
    const remainingDays = daysUntil(order.dueDate, input.referenceDate ?? new Date());
    if (remainingDays === undefined) {
      issues.push(issue("INVALID_DUE_DATE", "The due date could not be interpreted safely.", "error", "dueDate"));
    } else if (remainingDays <= mockRules.rush.thresholdDays) {
      issues.push(
        issue(
          "RUSH_DUE_DATE",
          `The due date is ${remainingDays < 0 ? "past due" : `${remainingDays} day${remainingDays === 1 ? "" : "s"} away`} and requires review.`,
          "warning",
          "dueDate",
        ),
      );
    }
  }

  if (input.intent === "order_change") {
    issues.push(issue("ORDER_CHANGE_REQUIRES_REVIEW", "Changes to an existing order require human review.", "warning"));
  }
  if (input.intent === "reorder" && !order.productName) {
    issues.push(issue("UNCLEAR_REORDER_REFERENCE", "The reorder does not identify a safe prior-order or product reference.", "warning", "productName"));
  }
  if (
    customer &&
    order.artworkReference &&
    !customer.approvedArtworkRefs.includes(order.artworkReference)
  ) {
    issues.push(issue("UNAPPROVED_ARTWORK", "The artwork reference is not on the customer's approved list.", "warning", "artworkReference"));
  }
  if (order.quantity && catalogItem) {
    const minimum =
      mockRules.minimumQuantity.categoryMinimums[catalogItem.category] ??
      mockRules.minimumQuantity.defaultUnits;
    if (order.quantity < minimum) {
      issues.push(issue("BELOW_MINIMUM_QUANTITY", `The quantity is below the ${minimum}-unit catalog minimum.`, "warning", "quantity"));
    }
  }
  if (order.quantity && order.sizeBreakdown) {
    const sizeTotal = Object.values(order.sizeBreakdown).reduce(
      (total, quantity) => total + quantity,
      0,
    );
    if (sizeTotal !== order.quantity) {
      issues.push(issue("SIZE_BREAKDOWN_MISMATCH", `The size breakdown totals ${sizeTotal}, not ${order.quantity}.`, "error", "sizeBreakdown"));
    }
  }
  if (input.confidence < 0.65) {
    issues.push(issue("LOW_EXTRACTION_CONFIDENCE", "Extraction confidence is below the safe auto-processing threshold.", "warning"));
  }

  const criticalUncertainFields = new Set<keyof ExtractedOrder>([
    "productName",
    "quantity",
    "dueDate",
    "poNumber",
    "shippingLocation",
  ]);
  if (catalogItem?.requiresArtwork) {
    criticalUncertainFields.add("artworkReference");
  }

  const unresolvedUncertainty = input.uncertainFields.filter(
    (field) => order[field as keyof ExtractedOrder] !== undefined,
  );
  const criticalUncertainty = unresolvedUncertainty.filter((field) =>
    criticalUncertainFields.has(field as keyof ExtractedOrder),
  );
  const nonCriticalUncertainty = unresolvedUncertainty.filter(
    (field) => !criticalUncertainFields.has(field as keyof ExtractedOrder),
  );
  if (criticalUncertainty.length > 0) {
    issues.push(
      issue(
        "CRITICAL_UNCERTAIN_FIELDS",
        `Critical extracted values remain uncertain: ${criticalUncertainty.join(", ")}.`,
        "warning",
      ),
    );
  }
  if (nonCriticalUncertainty.length > 0) {
    issues.push(
      issue(
        "NON_CRITICAL_UNCERTAIN_FIELDS",
        `Non-critical extracted values remain uncertain: ${nonCriticalUncertainty.join(", ")}.`,
        "warning",
      ),
    );
  }
  if (input.intent === "unclear") {
    issues.push(issue("UNCLEAR_INTENT", "The purchase order intent requires human confirmation.", "warning"));
  }

  return issues;
}
