import { PageHeader } from "../app/PageHeader";
import { getCustomers } from "@/lib/domain/mockCustomers";
import type {
  DecorationMethod,
  PreferredOrderSystem,
  RushApprovalPolicy,
} from "@/lib/domain/types";

const rushPolicyLabels: Record<RushApprovalPolicy, string> = {
  pre_approved: "Pre-approved",
  manual_review: "Requires manual review",
  not_allowed: "Not allowed",
};

const decorationMethodLabels: Record<DecorationMethod, string> = {
  embroidery: "Embroidery",
  screen_print: "Screen print",
  direct_to_garment: "Direct to garment",
  heat_transfer: "Heat transfer",
};

const orderSystemLabels: Record<PreferredOrderSystem, string> = {
  print_ops: "Print Ops",
  merch_ops: "Merch Ops",
};

export function CustomersPage() {
  const customers = getCustomers();

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Customer configuration and business rule overrides"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div key={customer.id} className="border border-border rounded-lg bg-surface p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{customer.name}</h3>
            <div className="space-y-2">
              <ConfigRow label="CRM ID" value={customer.crmId} />
              <ConfigRow label="Default shipping" value={customer.defaultShippingLocation} />
              <ConfigRow label="Rush approval policy" value={rushPolicyLabels[customer.rushApprovalPolicy]} />
              <ConfigRow label="Approved artwork refs" value={customer.approvedArtworkRefs.join(", ")} />
              <ConfigRow label="Preferred decoration" value={decorationMethodLabels[customer.preferredDecorationMethod]} />
              <ConfigRow label="Preferred order system" value={orderSystemLabels[customer.preferredOrderSystem]} />
              <ConfigRow label="Operating profile" value={customer.operatingProfile} />
              <ConfigRow label="Notes" value={customer.notes} />
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
