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

const rushPolicyStyle: Record<RushApprovalPolicy, string> = {
  pre_approved: "bg-success/10 text-success",
  manual_review: "bg-warning/10 text-warning",
  not_allowed: "bg-danger/10 text-danger",
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
        subtitle="Customer configuration, business rule overrides, and operating profiles"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl border border-border/80 bg-surface shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border/40 bg-background/40">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {customer.name}
                </h3>
                <span className="text-xs font-mono text-muted">
                  {customer.crmId}
                </span>
              </div>
              {customer.operatingProfile && (
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  {customer.operatingProfile}
                </p>
              )}
            </div>

            <div className="px-5 py-4 space-y-3">
              <ConfigRow
                label="Default Shipping"
                value={customer.defaultShippingLocation}
              />
              <ConfigRow label="Rush Approval Policy">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${rushPolicyStyle[customer.rushApprovalPolicy]}`}
                >
                  {rushPolicyLabels[customer.rushApprovalPolicy]}
                </span>
              </ConfigRow>
              <ConfigRow label="Approved Artwork">
                <div className="flex flex-wrap gap-1.5">
                  {customer.approvedArtworkRefs.map((ref) => (
                    <span
                      key={ref}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-foreground/[0.04] text-foreground/70 border border-border/40"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </ConfigRow>
              <ConfigRow
                label="Preferred Decoration"
                value={decorationMethodLabels[customer.preferredDecorationMethod]}
              />
              <ConfigRow
                label="Preferred Order System"
                value={orderSystemLabels[customer.preferredOrderSystem]}
              />
              {customer.notes && (
                <ConfigRow label="Notes" value={customer.notes} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] text-muted uppercase tracking-wide font-medium">
        {label}
      </div>
      {children ?? (
        <div className="text-sm text-foreground/80 leading-relaxed">{value}</div>
      )}
    </div>
  );
}
