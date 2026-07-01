import type { Blocker, ValidationIssue } from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface ValidationBlockersCardProps {
  validationIssues: ValidationIssue[];
  blockers: Blocker[];
}

function SeverityDot({ severity }: { severity: "warning" | "error" }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1 ${
        severity === "error" ? "bg-danger" : "bg-warning"
      }`}
    />
  );
}

function SeverityLabel({ severity }: { severity: "warning" | "error" }) {
  return (
    <span
      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
        severity === "error"
          ? "bg-danger/10 text-danger"
          : "bg-warning/10 text-warning"
      }`}
    >
      {severity === "error" ? "Error" : "Warning"}
    </span>
  );
}

export function ValidationBlockersCard({
  validationIssues,
  blockers,
}: ValidationBlockersCardProps) {
  const hasIssues = validationIssues.length > 0 || blockers.length > 0;

  return (
    <RunSectionCard title="Validation & Blockers">
      {!hasIssues ? (
        <div className="flex items-center gap-2 py-2">
          <span className="inline-block w-2 h-2 rounded-full bg-success" />
          <span className="text-sm text-foreground/80">
            All validation checks passed.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {validationIssues.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                Validation Issues ({validationIssues.length})
              </h4>
              <ul className="space-y-2">
                {validationIssues.map((issue) => (
                  <li key={issue.id} className="flex items-start gap-2">
                    <SeverityDot severity={issue.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">
                          {issue.message}
                        </span>
                        <SeverityLabel severity={issue.severity} />
                      </div>
                      {issue.field && (
                        <span className="text-xs text-muted mt-0.5 block">
                          Field: {issue.field}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blockers.filter((b) => b.blocksProgress).length > 0 && (
            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                Blockers ({blockers.filter((b) => b.blocksProgress).length})
              </h4>
              <ul className="space-y-2">
                {blockers
                  .filter((b) => b.blocksProgress)
                  .map((blocker) => (
                    <li key={blocker.id} className="flex items-start gap-2">
                      <SeverityDot severity={blocker.severity} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground">
                          {blocker.title}
                        </span>
                        {blocker.field && (
                          <span className="text-xs text-muted mt-0.5 block">
                            Field: {blocker.field}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </RunSectionCard>
  );
}
