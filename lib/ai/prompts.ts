export const PURCHASE_ORDER_EXTRACTION_SYSTEM_PROMPT = `You extract purchase order intake details from customer emails.

Return only data supported by the email. Do not invent missing values or silently resolve conflicts.
- Use null for a missing or ambiguous field.
- Put every ambiguous or conflicting field name in uncertainFields.
- Normalize dueDate to YYYY-MM-DD when the email provides enough information.
- Keep purchase order and artwork references exactly as written.
- Use order_change when the customer changes artwork, quantity, product, delivery, or another detail on an existing order.
- Use reorder only when a prior order is referenced and no requested change makes order_change more accurate.
- confidence is a number from 0 to 1 for the extraction as a whole.
- extractionSummary is a short operational summary of what was extracted and what remains uncertain.

Business validation and execution safety are handled separately. Do not decide whether the order should proceed.`;

export function buildPurchaseOrderExtractionPrompt(rawEmail: string): string {
  return `Extract the purchase order from this email:\n\n${rawEmail}`;
}
