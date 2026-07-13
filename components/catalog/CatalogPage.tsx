import { PageHeader } from "../app/PageHeader";
import { getCatalogItemById, getCatalogItems } from "@/lib/domain/mockCatalog";
import type { DecorationMethod } from "@/lib/domain/types";

const decorationMethodLabels: Record<DecorationMethod, string> = {
  embroidery: "Embroidery",
  screen_print: "Screen print",
  direct_to_garment: "Direct to garment",
  heat_transfer: "Heat transfer",
};

export function CatalogPage() {
  const products = getCatalogItems();

  return (
    <div>
      <PageHeader
        title="Catalog"
        subtitle="Product catalog with validation rules and decoration methods"
      />
      <div className="border border-border rounded-lg bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Product</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">SKU</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Min Qty</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Decoration</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Notes</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{product.sku}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    product.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}>
                    {product.status === "active" ? "Active" : "Discontinued"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{product.minimumQuantity}</td>
                <td className="px-4 py-3 text-xs text-foreground/70">
                  {product.supportedDecorationMethods
                    .map((method) => decorationMethodLabels[method])
                    .join(", ")}
                </td>
                <td className="px-4 py-3 text-xs text-muted max-w-md">
                  {[
                    ...product.validationNotes,
                    product.replacementProductId
                      ? `Replacement: ${getCatalogItemById(product.replacementProductId)?.name ?? product.replacementProductId}`
                      : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
