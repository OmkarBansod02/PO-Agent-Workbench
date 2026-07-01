import type { ExtractedOrder } from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface ExtractedOrderCardProps {
  order: ExtractedOrder;
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-foreground">{children}</span>;
}

function Missing() {
  return (
    <span className="text-sm text-danger/70 italic">Missing</span>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  const display =
    value !== undefined && value !== null && value !== ""
      ? String(value)
      : null;

  return (
    <div>
      <span className="text-muted text-xs">{label}</span>
      <div className="mt-0.5">
        {display ? <Value>{display}</Value> : <Missing />}
      </div>
    </div>
  );
}

function formatSizeBreakdown(sizes: Record<string, number>): string {
  return Object.entries(sizes)
    .map(([size, qty]) => `${size} ${qty}`)
    .join(", ");
}

export function ExtractedOrderCard({ order }: ExtractedOrderCardProps) {
  return (
    <RunSectionCard title="Extracted Order">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
        <Field label="PO Number" value={order.poNumber} />
        <Field label="Customer" value={order.customerName} />
        <Field label="Requester" value={order.requesterName} />
        <Field label="Product" value={order.productName} />
        <Field label="Quantity" value={order.quantity} />
        <Field label="Color" value={order.color} />
        <div className="col-span-2 sm:col-span-3">
          <span className="text-muted text-xs">Size Breakdown</span>
          <div className="mt-0.5">
            {order.sizeBreakdown &&
            Object.keys(order.sizeBreakdown).length > 0 ? (
              <Value>{formatSizeBreakdown(order.sizeBreakdown)}</Value>
            ) : (
              <Missing />
            )}
          </div>
        </div>
        <Field label="Due Date" value={order.dueDate} />
        <Field label="Artwork Reference" value={order.artworkReference} />
        <Field label="Shipping Location" value={order.shippingLocation} />
        {order.notes && (
          <div className="col-span-2 sm:col-span-3">
            <span className="text-muted text-xs">Notes</span>
            <p className="text-sm text-foreground/80 mt-0.5">{order.notes}</p>
          </div>
        )}
      </div>
    </RunSectionCard>
  );
}
