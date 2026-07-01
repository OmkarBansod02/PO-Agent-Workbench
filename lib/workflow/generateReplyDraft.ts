import { zodTextFormat } from "openai/helpers/zod";
import { replyDraftSchema } from "../ai/schemas";
import {
  buildCustomerReplyDraftPrompt,
  CUSTOMER_REPLY_DRAFT_SYSTEM_PROMPT,
} from "../ai/prompts";
import {
  getOpenAIClient,
  getOpenAIModel,
  hasOpenAIConfiguration,
} from "../ai/provider";
import type {
  Blocker,
  ExtractedOrder,
  ReplyDraft,
  RouteDecision,
  ValidationIssue,
} from "../domain/types";

export interface GenerateReplyDraftInput {
  decision: RouteDecision;
  extractedOrder: ExtractedOrder;
  validationIssues: ValidationIssue[];
  blockers: Blocker[];
}

function listIssues(input: GenerateReplyDraftInput): string[] {
  const issueMessages = input.validationIssues.map(({ message }) => message);
  const blockerMessages = input.blockers.map(({ message }) => message);
  return [...new Set([...issueMessages, ...blockerMessages])];
}

function fallbackSubject(input: GenerateReplyDraftInput): string {
  const po = input.extractedOrder.poNumber;
  if (input.decision === "completed") {
    return po
      ? `Confirmation for purchase order ${po}`
      : "Confirmation for your purchase order";
  }

  return po
    ? `Clarification needed for purchase order ${po}`
    : "Clarification needed for your purchase order";
}

function formatOrderLine(input: GenerateReplyDraftInput): string {
  const { extractedOrder } = input;
  const details = [
    extractedOrder.quantity
      ? `${extractedOrder.quantity.toLocaleString("en-US")} units`
      : undefined,
    extractedOrder.productName,
    extractedOrder.color ? `in ${extractedOrder.color}` : undefined,
    extractedOrder.dueDate ? `needed by ${extractedOrder.dueDate}` : undefined,
  ].filter(Boolean);

  return details.length > 0
    ? details.join(" ")
    : "the purchase order details we received";
}

function fallbackDraft(input: GenerateReplyDraftInput): ReplyDraft {
  const requester = input.extractedOrder.requesterName
    ? `Hi ${input.extractedOrder.requesterName},`
    : "Hello,";
  const orderLine = formatOrderLine(input);

  if (input.decision === "completed") {
    return {
      subject: fallbackSubject(input),
      body: [
        requester,
        "",
        `Thanks for sending the purchase order. We have prepared the order workflow for ${orderLine}.`,
        "This is a draft confirmation only. Our team will review the prepared job details before any customer-facing email is sent.",
        "",
        "Best,",
        "PO Agent Workbench",
      ].join("\n"),
      tone: "professional",
      draftType: "confirmation",
      method: "fallback",
    };
  }

  const issues = listIssues(input);
  const issueLines =
    issues.length > 0
      ? issues.map((issue) => `- ${issue}`).join("\n")
      : "- Please confirm the missing or risky order details before production.";

  return {
    subject: fallbackSubject(input),
    body: [
      requester,
      "",
      `Thanks for sending the purchase order request. Before we prepare an order-system job for ${orderLine}, we need a human review of the following items:`,
      issueLines,
      "",
      "Please confirm the correct details and we will continue the order workflow after review.",
      "",
      "This is a draft clarification only and has not been sent.",
      "",
      "Best,",
      "PO Agent Workbench",
    ].join("\n"),
    tone: "professional",
    draftType: input.decision === "blocked" ? "clarification" : "review_required",
    method: "fallback",
  };
}

export async function generateReplyDraft(
  input: GenerateReplyDraftInput,
): Promise<ReplyDraft> {
  if (!hasOpenAIConfiguration()) {
    return fallbackDraft(input);
  }

  const model = getOpenAIModel();
  try {
    const response = await getOpenAIClient().responses.parse({
      model,
      input: [
        { role: "system", content: CUSTOMER_REPLY_DRAFT_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildCustomerReplyDraftPrompt({
            decision: input.decision,
            extractedOrder: input.extractedOrder,
            validationIssues: input.validationIssues,
            blockers: input.blockers,
          }),
        },
      ],
      text: {
        format: zodTextFormat(replyDraftSchema, "customer_reply_draft"),
      },
    });
    const parsed = replyDraftSchema.parse(response.output_parsed);

    return {
      subject: parsed.subject,
      body: parsed.body,
      tone: parsed.tone,
      draftType: parsed.draftType,
      method: "ai",
    };
  } catch {
    return fallbackDraft(input);
  }
}
