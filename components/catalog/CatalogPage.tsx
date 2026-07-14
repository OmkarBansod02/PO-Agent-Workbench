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
        title="Product Catalog"
        subtitle="Active and discontinued products with validation rules and decoration methods"
      />
      <div className="rounded-xl border border-border/80 bg-surface overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-background/60">
              <th className="text-left px-4 py-3 font-medium text-muted text-xs">Product</th>
              <th className="text-left px-4 py-3 font-medium text-muted text-xs">SKU</th>
              <th className="text-left px-4 py-3 font-medium text-muted text-xs">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted text-xs">Min Qty</th>
              <th className="text-left px-4 py-3 font-medium text-muted text-xs">Decoration Methods</th>
              <th className="text-left px-4 py-3 font-medium text-muted text-xs">Validation Notes</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isDiscontinued = product.status === "discontinued";
              const replacement = product.replacementProductId
                ? getCatalogItemById(product.replacementProductId)
                : undefined;

              return (
                <tr
                  key={product.id}
                  className={`border-b border-border/40 last:border-0 hover:bg-accent/[0.03] transition-colors ${
                    isDiscontinued ? "bg-danger/[0.02]" : ""
                  }`}
                >
                  <td className={`px-4 py-3.5 font-medium ${isDiscontinued ? "text-foreground/50" : "text-foreground"}`}>
                    {product.name}
                  </td>
                  <td className={`px-4 py-3.5 font-mono text-xs ${isDiscontinued ? "text-muted/60" : "text-muted"}`}>
                    {product.sku}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        isDiscontinued
                          ? "bg-danger/10 text-danger"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {isDiscontinued ? "Discontinued" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted">{product.minimumQuantity}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {product.supportedDecorationMethods.map((method) => (
                        <span
                          key={method}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] bg-foreground/[0.04] text-foreground/60"
                        >
                          {decorationMethodLabels[method]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted max-w-md">
                    <div className="space-y-1">
                      {product.validationNotes.map((note, i) => (
                        <p key={i} className="leading-relaxed">{note}</p>
                      ))}
                      {isDiscontinued && product.discontinuedReason && (
                        <p className="text-danger/80 font-medium">{product.discontinuedReason}</p>
                      )}
                      {replacement && (
                        <p className="text-accent font-medium">
                          Replacement: {replacement.name} ({replacement.sku})
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
