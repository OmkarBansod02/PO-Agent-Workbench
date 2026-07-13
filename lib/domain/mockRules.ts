import type { ExtractedOrder } from "./types";

export interface MockBusinessRules {
  requiredFields: Array<keyof Pick<
    ExtractedOrder,
    | "poNumber"
    | "customerId"
    | "catalogItemId"
    | "quantity"
    | "dueDate"
    | "shippingLocation"
  >>;
  rush: {
    thresholdDays: number;
    requiresHumanReview: boolean;
  };
  artworkReview: {
    requiredForDecoratedProducts: boolean;
    unapprovedReferenceRequiresReview: boolean;
    changedArtworkRequiresProofApproval: boolean;
  };
  discontinuedProducts: {
    requiresHumanReview: boolean;
    blocksAutomaticOrderCreation: boolean;
  };
  minimumQuantity: {
    defaultUnits: number;
    categoryMinimums: {
      apparel: number;
      headwear: number;
      bags: number;
    };
    belowMinimumBehavior: "warning" | "human_review" | "blocked";
  };
  sizeBreakdownMustMatchQuantity: boolean;
  reviewRiskThreshold: number;
}

export interface BusinessRuleSummary {
  id: string;
  name: string;
  category: "required_data" | "catalog" | "risk" | "human_review";
  description: string;
  automationImpact: string;
}

export const mockRules: MockBusinessRules = {
  requiredFields: [
    "poNumber",
    "customerId",
    "catalogItemId",
    "quantity",
    "dueDate",
    "shippingLocation",
  ],
  rush: {
    thresholdDays: 7,
    requiresHumanReview: true,
  },
  artworkReview: {
    requiredForDecoratedProducts: true,
    unapprovedReferenceRequiresReview: true,
    changedArtworkRequiresProofApproval: true,
  },
  discontinuedProducts: {
    requiresHumanReview: true,
    blocksAutomaticOrderCreation: true,
  },
  minimumQuantity: {
    defaultUnits: 24,
    categoryMinimums: {
      apparel: 24,
      headwear: 48,
      bags: 50,
    },
    belowMinimumBehavior: "human_review",
  },
  sizeBreakdownMustMatchQuantity: true,
  reviewRiskThreshold: 50,
};

export const businessRuleSummaries: BusinessRuleSummary[] = [
  {
    id: "required-order-fields",
    name: "Required order fields",
    category: "required_data",
    description:
      "PO number, customer, catalog item, quantity, due date, and shipping destination must be present.",
    automationImpact:
      "Missing required data blocks downstream order creation and requests human follow-up.",
  },
  {
    id: "rush-date-review",
    name: "Rush date review",
    category: "risk",
    description: `Due dates within ${mockRules.rush.thresholdDays} days require manual review unless approved.`,
    automationImpact:
      "The workflow can draft a reply but withholds automatic job creation until rush risk is approved.",
  },
  {
    id: "artwork-approval",
    name: "Artwork approval",
    category: "human_review",
    description:
      "Decorated products require artwork references, and unapproved artwork requires review.",
    automationImpact:
      "Approved artwork can proceed; changed or unknown artwork becomes a review blocker.",
  },
  {
    id: "catalog-availability",
    name: "Catalog availability",
    category: "catalog",
    description:
      "Unknown or discontinued catalog items are not safe for automatic order-system jobs.",
    automationImpact:
      "Discontinued products block job creation and ask the operator to confirm a replacement.",
  },
  {
    id: "quantity-safety",
    name: "Quantity safety",
    category: "catalog",
    description:
      "Quantities must meet catalog minimums, and size breakdowns must reconcile to the order total.",
    automationImpact:
      "Below-minimum or conflicting quantities require human review before action preparation.",
  },
];

export function getBusinessRules(): MockBusinessRules {
  return {
    ...mockRules,
    requiredFields: [...mockRules.requiredFields],
    rush: { ...mockRules.rush },
    artworkReview: { ...mockRules.artworkReview },
    discontinuedProducts: { ...mockRules.discontinuedProducts },
    minimumQuantity: {
      ...mockRules.minimumQuantity,
      categoryMinimums: { ...mockRules.minimumQuantity.categoryMinimums },
    },
  };
}

export function getBusinessRuleSummaries(): BusinessRuleSummary[] {
  return businessRuleSummaries.map((rule) => ({ ...rule }));
}
