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

export function blockersFromValidation(
  validationIssues: ValidationIssue[],
): Blocker[] {
  return validationIssues.map((validation) =>
    createBlocker({
      code: validation.code,
      title: validation.message,
      message: validation.message,
      severity: validation.severity,
      blocksProgress: PROGRESS_BLOCKING_CODES.has(validation.code),
      field: validation.field,
    }),
  );
}
