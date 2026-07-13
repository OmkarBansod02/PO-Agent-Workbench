import type { CatalogItem } from "./types";

export const mockCatalog: CatalogItem[] = [
  {
    id: "catalog-premium-pullover-hoodie",
    sku: "HD-PREM-400",
    name: "Premium Pullover Hoodie",
    category: "apparel",
    status: "active",
    active: true,
    minimumQuantity: 24,
    requiresArtwork: true,
    supportedDecorationMethods: ["embroidery", "screen_print"],
    validationNotes: [
      "Size breakdown should match the total quantity.",
      "Artwork reference is required before production.",
    ],
  },
  {
    id: "catalog-structured-cap",
    sku: "CAP-STRUCT-210",
    name: "Structured Cap",
    category: "headwear",
    status: "active",
    active: true,
    minimumQuantity: 48,
    requiresArtwork: true,
    supportedDecorationMethods: ["embroidery", "heat_transfer"],
    validationNotes: [
      "Rush dates require manual review for customers without pre-approval.",
      "Embroidery artwork must be on the customer's approved list.",
    ],
  },
  {
    id: "catalog-canvas-tote-bag",
    sku: "TOTE-CANVAS-220",
    name: "Canvas Tote Bag",
    category: "bags",
    status: "active",
    active: true,
    minimumQuantity: 50,
    requiresArtwork: true,
    supportedDecorationMethods: ["screen_print", "heat_transfer"],
    validationNotes: [
      "Artwork changes require proof approval before downstream job creation.",
      "Screen print artwork should include placement and color notes.",
    ],
  },
  {
    id: "catalog-performance-tee",
    sku: "TEE-PERF-330",
    name: "Performance Tee",
    category: "apparel",
    status: "active",
    active: true,
    minimumQuantity: 24,
    requiresArtwork: true,
    supportedDecorationMethods: [
      "screen_print",
      "direct_to_garment",
      "heat_transfer",
    ],
    validationNotes: [
      "Size breakdown should match the total quantity.",
      "Direct-to-garment orders should include artwork placement notes.",
    ],
  },
  {
    id: "catalog-legacy-cotton-tote",
    sku: "TOTE-LEGACY-10",
    name: "Legacy Cotton Tote",
    category: "bags",
    status: "discontinued",
    active: false,
    minimumQuantity: 50,
    requiresArtwork: true,
    supportedDecorationMethods: ["screen_print"],
    validationNotes: [
      "Discontinued products block automatic order creation.",
      "Review replacement availability before replying to the customer.",
    ],
    discontinuedReason:
      "Discontinued after the supplier retired this canvas weight.",
    replacementProductId: "catalog-canvas-tote-bag",
  },
];

function copyCatalogItem(item: CatalogItem): CatalogItem {
  return {
    ...item,
    supportedDecorationMethods: [...item.supportedDecorationMethods],
    validationNotes: [...item.validationNotes],
  };
}

export function getCatalogItems(): CatalogItem[] {
  return mockCatalog.map(copyCatalogItem);
}

export function getCatalogItemById(id: string): CatalogItem | undefined {
  const item = mockCatalog.find((candidate) => candidate.id === id);
  return item ? copyCatalogItem(item) : undefined;
}
