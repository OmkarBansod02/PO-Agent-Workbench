import { zodTextFormat } from "openai/helpers/zod";
import type { ExtractedOrder } from "../domain/types";
import { mockCatalog } from "../domain/mockCatalog";
import { mockCustomers } from "../domain/mockCustomers";
import { classifyIntent } from "../workflow/classifyIntent";
import {
  buildPurchaseOrderExtractionPrompt,
  PURCHASE_ORDER_EXTRACTION_SYSTEM_PROMPT,
} from "./prompts";
import {
  purchaseOrderExtractionSchema,
  type PurchaseOrderExtractionSchema,
} from "./schemas";
import {
  getOpenAIClient,
  getOpenAIModel,
  hasOpenAIConfiguration,
} from "./provider";
import type {
  ExtractPurchaseOrderInput,
  PurchaseOrderExtraction,
} from "./types";

function compactOrder(
  extraction: PurchaseOrderExtractionSchema,
): ExtractedOrder {
  const sizeBreakdown = extraction.sizeBreakdown?.reduce<Record<string, number>>(
    (sizes, entry) => ({ ...sizes, [entry.size]: entry.quantity }),
    {},
  );

  return Object.fromEntries(
    Object.entries({
      customerName: extraction.customerName,
      requesterName: extraction.requesterName,
      requesterEmail: extraction.requesterEmail,
      poNumber: extraction.poNumber,
      productName: extraction.productName,
      quantity: extraction.quantity,
      color: extraction.color,
      sizeBreakdown,
      dueDate: extraction.dueDate,
      artworkReference: extraction.artworkReference,
      shippingLocation: extraction.shippingLocation,
      notes: extraction.notes,
    }).filter(([, value]) => value !== null && value !== undefined),
  ) as ExtractedOrder;
}

function normalizeDate(value: string): string | undefined {
  const hasYear = /\b\d{4}\b/.test(value);
  const datedValue = hasYear ? value : `${value}, ${new Date().getUTCFullYear()}`;
  const date = new Date(datedValue);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function extractFallback(rawEmail: string): PurchaseOrderExtraction {
  const intent = classifyIntent(rawEmail);
  const uncertainFields: string[] = [];
  const customer = mockCustomers.find(({ name }) =>
    rawEmail.toLowerCase().includes(name.toLowerCase()),
  );
  const catalogItem = mockCatalog.find(
    ({ name, sku }) =>
      rawEmail.toLowerCase().includes(name.toLowerCase()) ||
      rawEmail.toLowerCase().includes(sku.toLowerCase()),
  );
  const ambiguousQuantity = /\b(?:either|between)\s+\d+\s+(?:or|and)\s+\d+/i.test(rawEmail);
  const quantityMatch = ambiguousQuantity
    ? undefined
    : rawEmail.match(/(?:quantity:\s*|(?:reorder|order of)\s+)(\d[\d,]*)/i);
  const poNumber =
    rawEmail.match(/\bPO(?: number)?\s*(?::|is)\s*(PO[-A-Z0-9]+|\d{4,})\b/i)?.[1] ??
    rawEmail.match(/\bPO-[A-Z0-9-]+\b/i)?.[0];
  const dueDateText = rawEmail.match(
    /(?:in-hands date|requested delivery|required delivery|delivered by)\s*:?\s*([^\n.]+)/i,
  )?.[1];
  const shippingLocation = rawEmail.match(/ship to:\s*([^\n]+)/i)?.[1]?.trim();
  const requesterName = rawEmail.match(
    /(?:thank you|thanks|regards),?\s*\n([A-Z][^\n]+)/i,
  )?.[1];
  const requesterEmail = rawEmail.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  )?.[0];
  const artworkReference = rawEmail.match(
    /\b(?:AL|NR|MW|CP)-[A-Z0-9]+(?:-[A-Z0-9]+)+\b/i,
  )?.[0];
  const sizeLine = rawEmail.match(/sizes:\s*([^\n]+)/i)?.[1];
  const sizeBreakdown = sizeLine
    ? Object.fromEntries(
        Array.from(sizeLine.matchAll(/(XS|S|M|L|XL|[2-6]XL)\s+(\d+)/gi)).map(
          ([, size, amount]) => [size.toUpperCase(), Number(amount)],
        ),
      )
    : undefined;

  if (ambiguousQuantity) uncertainFields.push("quantity");
  if (!poNumber) uncertainFields.push("poNumber");
  if (!artworkReference && catalogItem?.requiresArtwork) {
    uncertainFields.push("artworkReference");
  }
  if (!customer) uncertainFields.push("customerName");
  if (!catalogItem) uncertainFields.push("productName");
  if (!dueDateText) uncertainFields.push("dueDate");
  if (!shippingLocation) uncertainFields.push("shippingLocation");

  const color =
    rawEmail.match(/color:\s*([^\n]+)/i)?.[1]?.trim() ??
    rawEmail.match(/\bin ([a-z ]+?)(?: screen print|,|\.)/i)?.[1]?.trim() ??
    (rawEmail.match(/\b(natural canvas|forest green)\b/i)?.[1] ?? undefined);

  const extractedOrder: ExtractedOrder = {
    customerName: customer?.name,
    requesterName,
    requesterEmail,
    poNumber,
    productName: catalogItem?.name,
    quantity: quantityMatch ? Number(quantityMatch[1].replaceAll(",", "")) : undefined,
    color,
    sizeBreakdown,
    dueDate: dueDateText ? normalizeDate(dueDateText.trim()) : undefined,
    artworkReference,
    shippingLocation,
    notes:
      intent === "order_change"
        ? "Customer requested a change to an existing order or reorder."
        : ambiguousQuantity
          ? "The email contains conflicting quantity options."
          : undefined,
  };
  const presentFieldCount = Object.values(extractedOrder).filter(
    (value) => value !== undefined,
  ).length;
  const confidence = Math.max(
    0.35,
    Math.min(0.95, 0.55 + presentFieldCount * 0.045 - uncertainFields.length * 0.07),
  );

  return {
    method: "fallback",
    intent,
    extractedOrder,
    confidence,
    uncertainFields: [...new Set(uncertainFields)],
    extractionSummary: uncertainFields.length
      ? `Deterministic extraction completed with uncertainty in: ${[...new Set(uncertainFields)].join(", ")}.`
      : "Deterministic extraction found the core purchase order details.",
  };
}

export async function extractPurchaseOrder(
  input: ExtractPurchaseOrderInput,
): Promise<PurchaseOrderExtraction> {
  if (!hasOpenAIConfiguration()) {
    return { ...extractFallback(input.rawEmail), fallbackReason: "api_key_missing" };
  }

  const model = getOpenAIModel();
  try {
    const response = await getOpenAIClient().responses.parse({
      model,
      input: [
        { role: "system", content: PURCHASE_ORDER_EXTRACTION_SYSTEM_PROMPT },
        { role: "user", content: buildPurchaseOrderExtractionPrompt(input.rawEmail) },
      ],
      text: {
        format: zodTextFormat(
          purchaseOrderExtractionSchema,
          "purchase_order_extraction",
        ),
      },
    });
    const parsed = purchaseOrderExtractionSchema.parse(response.output_parsed);

    return {
      method: "ai",
      model,
      intent: parsed.intent,
      extractedOrder: compactOrder(parsed),
      confidence: parsed.confidence,
      uncertainFields: parsed.uncertainFields,
      extractionSummary: parsed.extractionSummary,
      rawModelOutput: response.output,
    };
  } catch {
    return { ...extractFallback(input.rawEmail), fallbackReason: "ai_request_failed" };
  }
}
