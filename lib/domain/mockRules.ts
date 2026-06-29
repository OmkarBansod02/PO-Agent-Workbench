export interface MockBusinessRules {
  requirePoNumber: boolean;
  requireRecognizedCustomer: boolean;
  requireQuantity: boolean;
  requireDueDate: boolean;
  minimumRushLeadTimeDays: number;
  requireShippingDestination: boolean;
  requireArtworkForDecoratedItems: boolean;
  requireSizeBreakdownToMatchQuantity: boolean;
  reviewRushOrders: boolean;
  reviewDiscontinuedItems: boolean;
  reviewRiskThreshold: number;
}

export const mockRules: MockBusinessRules = {
  requirePoNumber: true,
  requireRecognizedCustomer: true,
  requireQuantity: true,
  requireDueDate: true,
  minimumRushLeadTimeDays: 7,
  requireShippingDestination: true,
  requireArtworkForDecoratedItems: true,
  requireSizeBreakdownToMatchQuantity: true,
  reviewRushOrders: true,
  reviewDiscontinuedItems: true,
  reviewRiskThreshold: 50,
};
