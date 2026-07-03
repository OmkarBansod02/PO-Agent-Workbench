import { NextResponse } from "next/server";
import type {
  ExtractedOrder,
  HumanReviewApprovals,
  WorkflowRun,
} from "@/lib/domain/types";
import { applyHumanReview } from "@/lib/workflow/applyHumanReview";

interface ReviewRequestBody {
  previousRun?: WorkflowRun;
  corrections?: Partial<ExtractedOrder>;
  reviewerName?: string;
  reviewerNote?: string;
  approvals?: HumanReviewApprovals;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const STRING_ORDER_FIELDS = new Set([
  "customerName",
  "requesterName",
  "requesterEmail",
  "poNumber",
  "productName",
  "color",
  "customerId",
  "catalogItemId",
  "dueDate",
  "artworkReference",
  "shippingLocation",
  "notes",
]);
const ORDER_FIELDS = new Set([
  ...STRING_ORDER_FIELDS,
  "quantity",
  "sizeBreakdown",
]);

function isExtractedOrder(value: unknown): value is ExtractedOrder {
  if (!isObject(value)) return false;

  return Object.entries(value).every(([field, fieldValue]) => {
    if (!ORDER_FIELDS.has(field)) return false;
    if (STRING_ORDER_FIELDS.has(field)) return typeof fieldValue === "string";
    if (field === "quantity") {
      return typeof fieldValue === "number" && Number.isFinite(fieldValue);
    }
    if (field === "sizeBreakdown") {
      return (
        isObject(fieldValue) &&
        Object.values(fieldValue).every(
          (quantity) => typeof quantity === "number" && Number.isFinite(quantity),
        )
      );
    }
    return false;
  });
}

function isApprovals(value: unknown): value is HumanReviewApprovals {
  if (!isObject(value)) return false;
  const allowed = new Set([
    "rushApproved",
    "artworkChangeApproved",
    "customerConfirmed",
  ]);
  return Object.entries(value).every(
    ([name, approved]) => allowed.has(name) && typeof approved === "boolean",
  );
}

function hasUsablePreviousRun(value: unknown): value is WorkflowRun {
  if (!isObject(value) || !isExtractedOrder(value.extractedOrder)) return false;
  return (
    typeof value.runId === "string" &&
    typeof value.emailId === "string" &&
    typeof value.intent === "string" &&
    typeof value.aiConfidence === "number" &&
    Array.isArray(value.traceEvents) &&
    value.traceEvents.every(isObject) &&
    Array.isArray(value.uncertainFields) &&
    value.uncertainFields.every((field) => typeof field === "string") &&
    Array.isArray(value.approvalGates) &&
    value.approvalGates.every(isObject)
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The review request must contain valid JSON." },
      { status: 400 },
    );
  }

  if (!isObject(body) || !body.previousRun) {
    return NextResponse.json(
      { error: "A previous workflow run is required." },
      { status: 400 },
    );
  }

  try {
    const review = body as ReviewRequestBody;
    if (
      !hasUsablePreviousRun(review.previousRun) ||
      typeof review.reviewerName !== "string" ||
      review.reviewerName.trim().length === 0 ||
      (review.reviewerNote !== undefined &&
        typeof review.reviewerNote !== "string") ||
      (review.corrections !== undefined &&
        !isExtractedOrder(review.corrections)) ||
      (review.approvals !== undefined && !isApprovals(review.approvals))
    ) {
      return NextResponse.json(
        { error: "The review request is incomplete or invalid." },
        { status: 400 },
      );
    }

    const workflowRun = await applyHumanReview({
      previousRun: review.previousRun,
      corrections: review.corrections ?? {},
      reviewerName: review.reviewerName.trim(),
      reviewerNote: review.reviewerNote,
      approvals: review.approvals,
    });

    return NextResponse.json({ workflowRun });
  } catch {
    return NextResponse.json(
      { error: "The human review could not be applied safely." },
      { status: 500 },
    );
  }
}
