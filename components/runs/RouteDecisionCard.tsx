import type { RouteDecision } from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface RouteDecisionCardProps {
  decision: RouteDecision;
  riskScore: number;
}

const decisionConfig: Record<
  RouteDecision,
  { label: string; explanation: string; dotColor: string; bgColor: string }
> = {
  completed: {
    label: "Ready for downstream actions",
    explanation:
      "Extraction and validation passed. The order is safe for downstream job creation, CRM logging, and customer confirmation.",
    dotColor: "bg-success",
    bgColor: "bg-success/5",
  },
  needs_review: {
    label: "Needs human review",
    explanation:
      "One or more warnings require a human operator to review before downstream actions can proceed safely.",
    dotColor: "bg-warning",
    bgColor: "bg-warning/5",
  },
  blocked: {
    label: "Blocked before action",
    explanation:
      "Required data is missing or a critical rule failed. The order cannot proceed until blockers are resolved.",
    dotColor: "bg-danger",
    bgColor: "bg-danger/5",
  },
};

function riskColor(score: number): string {
  if (score <= 20) return "text-success";
  if (score <= 50) return "text-warning";
  return "text-danger";
}

export function RouteDecisionCard({ decision, riskScore }: RouteDecisionCardProps) {
  const config = decisionConfig[decision];

  return (
    <RunSectionCard title="Route Decision">
      <div className={`rounded-md px-4 py-3 ${config.bgColor}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          <span className="text-sm font-semibold text-foreground">
            {config.label}
          </span>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          {config.explanation}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div>
          <span className="text-muted text-xs">Risk Score</span>
          <p className={`text-lg font-semibold tabular-nums ${riskColor(riskScore)}`}>
            {riskScore}
          </p>
        </div>
      </div>
    </RunSectionCard>
  );
}
