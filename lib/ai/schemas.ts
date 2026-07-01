import { z } from "zod";

export const purchaseOrderExtractionSchema = z.object({
  intent: z.enum(["new_order", "reorder", "order_change", "unclear"]),
  customerName: z.string().nullable(),
  requesterName: z.string().nullable(),
  requesterEmail: z.string().nullable(),
  poNumber: z.string().nullable(),
  productName: z.string().nullable(),
  quantity: z.number().int().positive().nullable(),
  color: z.string().nullable(),
  sizeBreakdown: z
    .array(
      z.object({
        size: z.string(),
        quantity: z.number().int().nonnegative(),
      }),
    )
    .nullable(),
  dueDate: z.string().nullable(),
  artworkReference: z.string().nullable(),
  shippingLocation: z.string().nullable(),
  notes: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  uncertainFields: z.array(z.string()),
  extractionSummary: z.string(),
});

export type PurchaseOrderExtractionSchema = z.infer<
  typeof purchaseOrderExtractionSchema
>;

export const replyDraftSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  tone: z.literal("professional"),
  draftType: z.enum(["confirmation", "clarification", "review_required"]),
});

export type ReplyDraftSchema = z.infer<typeof replyDraftSchema>;
