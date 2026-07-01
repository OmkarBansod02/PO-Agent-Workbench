import type {
  ExtractedOrder,
  ExtractionMethod,
  PurchaseOrderIntent,
} from "../domain/types";

export interface PurchaseOrderExtraction {
  intent: PurchaseOrderIntent;
  method: ExtractionMethod;
  model?: string;
  extractedOrder: ExtractedOrder;
  confidence: number;
  uncertainFields: string[];
  extractionSummary: string;
  rawModelOutput?: unknown;
  fallbackReason?: "api_key_missing" | "ai_request_failed";
}

export interface ExtractPurchaseOrderInput {
  rawEmail: string;
}
