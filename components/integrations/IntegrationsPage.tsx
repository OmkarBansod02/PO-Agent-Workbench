import { PageHeader } from "../app/PageHeader";
import {
  getIntegrationStatuses,
  type IntegrationConnectionStatus,
} from "@/lib/integrations/adapters";

const statusConfig: Record<
  IntegrationConnectionStatus,
  { label: string; dotColor: string; badgeClass: string }
> = {
  connected: {
    label: "Connected",
    dotColor: "bg-success",
    badgeClass: "bg-success/10 text-success",
  },
  simulated: {
    label: "Simulated Adapter",
    dotColor: "bg-success",
    badgeClass: "bg-success/10 text-success",
  },
  draft_only: {
    label: "Draft-Only",
    dotColor: "bg-warning",
    badgeClass: "bg-warning/10 text-warning",
  },
  not_configured: {
    label: "Not Configured",
    dotColor: "bg-foreground/20",
    badgeClass: "bg-foreground/5 text-muted",
  },
};

export function IntegrationsPage() {
  const integrations = getIntegrationStatuses();

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connected systems and adapter status for each workflow boundary"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {integrations.map((integration) => {
          const config = statusConfig[integration.status];
          return (
            <div
              key={integration.id}
              className="rounded-xl border border-border/80 bg-surface shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border/40 bg-background/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <h3 className="text-sm font-semibold text-foreground">
                      {integration.name}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${config.badgeClass}`}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {integration.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted uppercase tracking-wide font-medium">
                    Mode
                  </span>
                  <span className="text-xs text-foreground/70 font-medium">
                    {integration.mode}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {integration.safetyNote}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
