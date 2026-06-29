export interface MockBusinessRules {
  minimumRushLeadTimeDays: number;
  requireShippingDestination: boolean;
  requireArtworkForDecoratedItems: boolean;
  reviewRiskThreshold: number;
}

export const mockRules: MockBusinessRules = {
  minimumRushLeadTimeDays: 7,
  requireShippingDestination: true,
  requireArtworkForDecoratedItems: true,
  reviewRiskThreshold: 50,
};
