import Link from "next/link";
import { StatusBadge } from "../app/StatusBadge";
import { getDemoRunSummaries } from "@/lib/workflow/demoRunSummaries";

function formatLastUpdated(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function RunsTable() {
  const runs = getDemoRunSummaries();

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Customer</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Subject</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Outcome</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Source</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Updated</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.runId} className="border-b border-border last:border-0 hover:bg-foreground/[0.02] transition-colors">
              <td className="px-4 py-3">
                <Link href={run.linkTarget} className="font-medium text-foreground hover:text-accent">
                  {run.customerName}
                </Link>
              </td>
              <td className="px-4 py-3 text-foreground/80">{run.subject}</td>
              <td className="px-4 py-3">
                <StatusBadge status={run.state} />
              </td>
              <td className="px-4 py-3 text-muted text-xs max-w-sm">
                {run.outcomeSummary}
              </td>
              <td className="px-4 py-3 text-muted text-xs">{run.source}</td>
              <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                {formatLastUpdated(run.lastUpdated)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
