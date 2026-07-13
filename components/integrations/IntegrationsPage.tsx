import { PageHeader } from "../app/PageHeader";
import {
  getIntegrationStatuses,
  type IntegrationConnectionStatus,
} from "@/lib/integrations/adapters";

const colorMap = {
  connected: "bg-success/10 text-success",
  simulated: "bg-success/10 text-success",
  draft_only: "bg-warning/10 text-warning",
  not_configured: "bg-foreground/5 text-muted",
};

const statusLabels: Record<IntegrationConnectionStatus, string> = {
  connected: "Connected",
  not_configured: "Not configured",
  simulated: "Simulated adapter active",
  draft_only: "Draft-only mode",
};

export function IntegrationsPage() {
  const integrations = getIntegrationStatuses();

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connected systems and adapter status"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="border border-border rounded-lg bg-surface p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${colorMap[integration.status]}`}>
                {statusLabels[integration.status]}
              </span>
            </div>
            <p className="text-xs text-muted mb-2">{integration.description}</p>
            <p className="text-xs font-medium text-foreground/70 mb-1">
              {integration.mode}
            </p>
            <p className="text-xs text-foreground/60">{integration.safetyNote}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
