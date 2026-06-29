import type { CatalogItem } from "./types";

export const mockCatalog: CatalogItem[] = [
  {
    id: "catalog-classic-tee",
    sku: "TEE-CLASSIC",
    name: "Classic cotton tee",
    active: true,
    requiresArtwork: true,
  },
  {
    id: "catalog-legacy-hoodie",
    sku: "HD-LEGACY",
    name: "Legacy pullover hoodie",
    active: false,
    requiresArtwork: true,
  },
];
