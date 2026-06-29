import { PageHeader } from "../app/PageHeader";

const integrations = [
  {
    name: "Demo Inbox",
    description: "Simulated email intake for purchase order messages",
    status: "Connected",
    statusColor: "success" as const,
    detail: "3 emails loaded from sample data",
  },
  {
    name: "AgentMail",
    description: "Production email integration for live PO intake",
    status: "Not configured",
    statusColor: "muted" as const,
    detail: "Available for Phase 1 integration",
  },
  {
    name: "Order System",
    description: "Print/promotional order management system",
    status: "Simulated adapter active",
    statusColor: "success" as const,
    detail: "Creates job records in local state",
  },
  {
    name: "CRM",
    description: "Customer relationship management activity logging",
    status: "Simulated adapter active",
    statusColor: "success" as const,
    detail: "Logs workflow activities per customer",
  },
  {
    name: "Customer Reply",
    description: "Outbound email generation for order confirmations",
    status: "Draft-only mode",
    statusColor: "warning" as const,
    detail: "Generates drafts without sending",
  },
];

const colorMap = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  muted: "bg-foreground/5 text-muted",
};

export function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connected systems and adapter status"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div key={integration.name} className="border border-border rounded-lg bg-surface p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${colorMap[integration.statusColor]}`}>
                {integration.status}
              </span>
            </div>
            <p className="text-xs text-muted mb-2">{integration.description}</p>
            <p className="text-xs text-foreground/60">{integration.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
