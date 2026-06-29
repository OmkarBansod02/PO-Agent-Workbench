import type { CatalogItem } from "./types";

export const mockCatalog: CatalogItem[] = [
  {
    id: "catalog-premium-pullover-hoodie",
    sku: "HD-PREM-400",
    name: "Premium Pullover Hoodie",
    category: "apparel",
    active: true,
    requiresArtwork: true,
    supportedDecorationMethods: ["embroidery", "screen_print"],
  },
  {
    id: "catalog-structured-cap",
    sku: "CAP-STRUCT-210",
    name: "Structured Cap",
    category: "headwear",
    active: true,
    requiresArtwork: true,
    supportedDecorationMethods: ["embroidery", "heat_transfer"],
  },
  {
    id: "catalog-canvas-tote-bag",
    sku: "TOTE-CANVAS-220",
    name: "Canvas Tote Bag",
    category: "bags",
    active: true,
    requiresArtwork: true,
    supportedDecorationMethods: ["screen_print", "heat_transfer"],
  },
  {
    id: "catalog-performance-tee",
    sku: "TEE-PERF-330",
    name: "Performance Tee",
    category: "apparel",
    active: true,
    requiresArtwork: true,
    supportedDecorationMethods: [
      "screen_print",
      "direct_to_garment",
      "heat_transfer",
    ],
  },
  {
    id: "catalog-legacy-cotton-tote",
    sku: "TOTE-LEGACY-10",
    name: "Legacy Cotton Tote",
    category: "bags",
    active: false,
    requiresArtwork: true,
    supportedDecorationMethods: ["screen_print"],
    discontinuedReason:
      "Discontinued after the supplier retired this canvas weight.",
  },
];

export function getCatalogItemById(id: string): CatalogItem | undefined {
  return mockCatalog.find((item) => item.id === id);
}
