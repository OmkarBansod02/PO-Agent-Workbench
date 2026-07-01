import type { Blocker, ValidationIssue } from "../domain/types";
import { createId } from "../utils/ids";

export type CreateBlockerInput = Omit<Blocker, "id"> & { id?: string };

export function createBlocker(input: CreateBlockerInput): Blocker {
  return {
    ...input,
    id: input.id ?? createId("blocker"),
  };
}

const PROGRESS_BLOCKING_CODES = new Set([
  "MISSING_PO_NUMBER",
  "MISSING_QUANTITY",
  "MISSING_PRODUCT",
  "MISSING_DUE_DATE",
  "UNKNOWN_CUSTOMER",
  "INACTIVE_CUSTOMER",
  "UNKNOWN_CATALOG_ITEM",
  "DISCONTINUED_CATALOG_ITEM",
  "MISSING_ARTWORK_REFERENCE",
  "MISSING_SHIPPING_LOCATION",
  "INVALID_DUE_DATE",
]);

const REVIEW_REQUIRED_CODES = new Set([
  "RUSH_DUE_DATE",
  "ORDER_CHANGE_REQUIRES_REVIEW",
  "UNCLEAR_REORDER_REFERENCE",
  "UNAPPROVED_ARTWORK",
  "BELOW_MINIMUM_QUANTITY",
  "SIZE_BREAKDOWN_MISMATCH",
  "LOW_EXTRACTION_CONFIDENCE",
  "CRITICAL_UNCERTAIN_FIELDS",
  "UNCLEAR_INTENT",
  "CUSTOMER_IDENTITY_CONFLICT",
]);

export function blockersFromValidation(
  validationIssues: ValidationIssue[],
): Blocker[] {
  return validationIssues.flatMap((validation) => {
    const blocksProgress = PROGRESS_BLOCKING_CODES.has(validation.code);
    const requiresReview = REVIEW_REQUIRED_CODES.has(validation.code);

    if (!blocksProgress && !requiresReview) return [];

    return createBlocker({
      code: validation.code,
      title: validation.message,
      message: validation.message,
      severity: validation.severity,
      blocksProgress,
      field: validation.field,
    });
  });
}
