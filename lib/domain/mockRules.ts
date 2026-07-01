import type { ExtractedOrder } from "./types";

export interface MockBusinessRules {
  requiredFields: Array<keyof Pick<
    ExtractedOrder,
    | "poNumber"
    | "customerId"
    | "catalogItemId"
    | "quantity"
    | "dueDate"
    | "shippingDestination"
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

export const mockRules: MockBusinessRules = {
  requiredFields: [
    "poNumber",
    "customerId",
    "catalogItemId",
    "quantity",
    "dueDate",
    "shippingDestination",
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
