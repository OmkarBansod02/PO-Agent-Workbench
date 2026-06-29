import { PageHeader } from "../app/PageHeader";

const products = [
  {
    name: "Classic Pullover Hoodie",
    sku: "H-200",
    status: "Active",
    minQty: 50,
    decoration: "Screen print, Embroidery",
    notes: "Standard 2-week lead time",
  },
  {
    name: "Structured Cap",
    sku: "C-110",
    status: "Active",
    minQty: 100,
    decoration: "Embroidery only",
    notes: "Rush available with 5-day lead",
  },
  {
    name: "Canvas Tote Bag",
    sku: "T-050",
    status: "Active",
    minQty: 200,
    decoration: "Screen print, Heat transfer",
    notes: "Artwork must be vector format",
  },
  {
    name: "Performance Polo",
    sku: "P-300",
    status: "Discontinued",
    minQty: 75,
    decoration: "Embroidery",
    notes: "Replacement: P-310 Dry-fit Polo",
  },
  {
    name: "Crew Neck T-Shirt",
    sku: "TS-100",
    status: "Active",
    minQty: 100,
    decoration: "Screen print, DTG",
    notes: "Size breakdown required for orders > 200",
  },
];

export function CatalogPage() {
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
              <tr key={product.sku} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{product.sku}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    product.status === "Active"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{product.minQty}</td>
                <td className="px-4 py-3 text-xs text-foreground/70">{product.decoration}</td>
                <td className="px-4 py-3 text-xs text-muted">{product.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
