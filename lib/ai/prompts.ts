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

export const CUSTOMER_REPLY_DRAFT_SYSTEM_PROMPT = `You draft customer-facing purchase order workflow emails.

Write concise, professional drafts only. Do not imply the email has been sent.
Do not decide whether an order should proceed; the route decision and validation issues are provided by deterministic business logic.
For completed workflows, draft a confirmation.
For needs_review or blocked workflows, draft a clarification asking for the missing, risky, or unsafe details.
Return only the requested structured draft fields.`;

interface BuildCustomerReplyDraftPromptInput {
  decision: string;
  extractedOrder: unknown;
  validationIssues: unknown;
  blockers: unknown;
}

export function buildCustomerReplyDraftPrompt(
  input: BuildCustomerReplyDraftPromptInput,
): string {
  return `Draft a customer reply for this purchase order workflow.

Route decision: ${input.decision}

Extracted order:
${JSON.stringify(input.extractedOrder, null, 2)}

Validation issues:
${JSON.stringify(input.validationIssues, null, 2)}

Blockers:
${JSON.stringify(input.blockers, null, 2)}

Rules:
- The email is draft-only and must not be described as sent.
- Do not promise production has started.
- If the route decision is completed, confirm the prepared order details.
- If the route decision is needs_review or blocked, ask for clarification on the listed issues.`;
}
