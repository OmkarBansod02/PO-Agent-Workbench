import { mockCatalog } from "../domain/mockCatalog";
import type { CatalogItem, ExtractedOrder } from "../domain/types";

export interface CatalogMatch {
  catalogItem?: CatalogItem;
  matchedBy?: "catalog_item_id" | "sku" | "name";
}

function normalizeProduct(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word))
    .join(" ");
}

export function matchCatalog(
  extractedOrder: ExtractedOrder,
  rawEmail: string,
): CatalogMatch {
  if (extractedOrder.catalogItemId) {
    const catalogItem = mockCatalog.find(
      ({ id }) => id === extractedOrder.catalogItemId,
    );
    if (catalogItem) return { catalogItem, matchedBy: "catalog_item_id" };
  }

  const searchable = `${extractedOrder.productName ?? ""} ${rawEmail}`;
  const skuMatch = mockCatalog.find(({ sku }) =>
    searchable.toLowerCase().includes(sku.toLowerCase()),
  );
  if (skuMatch) return { catalogItem: skuMatch, matchedBy: "sku" };

  const normalizedSearchable = normalizeProduct(searchable);
  const nameMatch = mockCatalog.find(({ name }) =>
    normalizedSearchable.includes(normalizeProduct(name)),
  );

  return nameMatch
    ? { catalogItem: nameMatch, matchedBy: "name" }
    : { catalogItem: undefined };
}
