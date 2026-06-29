import { PageHeader } from "../app/PageHeader";

const customers = [
  {
    name: "Arbor Lane Co.",
    shipping: "42 Industrial Pkwy, Columbus OH 43215",
    rushPolicy: "Auto-approve up to 500 units",
    artwork: "arborlane-logo-v3.ai, arborlane-wordmark.pdf",
    orderSystem: "Simulated adapter",
  },
  {
    name: "North Ridge Supply",
    shipping: "118 Distribution Dr, Denver CO 80216",
    rushPolicy: "Requires manual approval",
    artwork: "northridge-emblem.ai",
    orderSystem: "Simulated adapter",
  },
  {
    name: "Maple Works Studio",
    shipping: "7 Design Row, Portland OR 97201",
    rushPolicy: "Auto-approve under 200 units",
    artwork: "maple-tree-icon.svg, maple-type-lockup.ai",
    orderSystem: "Simulated adapter",
  },
];

export function CustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Customer configuration and business rule overrides"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div key={customer.name} className="border border-border rounded-lg bg-surface p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{customer.name}</h3>
            <div className="space-y-2">
              <ConfigRow label="Default shipping" value={customer.shipping} />
              <ConfigRow label="Rush approval policy" value={customer.rushPolicy} />
              <ConfigRow label="Approved artwork refs" value={customer.artwork} />
              <ConfigRow label="Preferred order system" value={customer.orderSystem} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-2 last:border-0 last:pb-0">
      <div className="text-[11px] text-muted uppercase tracking-wide">{label}</div>
      <div className="text-xs text-foreground mt-0.5">{value}</div>
    </div>
  );
}
