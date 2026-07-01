import type { PurchaseOrderIntent } from "../domain/types";

export function classifyIntent(rawEmail: string): PurchaseOrderIntent {
  const text = rawEmail.toLowerCase();

  if (/\b(change|replace|revise|update|amend)\b/.test(text)) {
    return "order_change";
  }

  if (/\b(reorder|re-order|repeat|same as (?:before|last time))\b/.test(text)) {
    return "reorder";
  }

  if (/\b(?:purchase order|new order|po[- :#]|quantity:)\b/.test(text)) {
    return "new_order";
  }

  return "unclear";
}
