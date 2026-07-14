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
    <div className="rounded-xl border border-border/80 bg-surface overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">Customer</th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">Subject</th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">State</th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">Outcome</th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">Source</th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">Last Updated</th>
            <th className="text-right px-4 py-3 font-medium text-muted text-xs"></th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.runId} className="border-b border-border/40 last:border-0 hover:bg-accent/[0.03] transition-colors">
              <td className="px-4 py-3.5 font-medium text-foreground">{run.customerName}</td>
              <td className="px-4 py-3.5 text-foreground/80 max-w-xs truncate">{run.subject}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={run.state} />
              </td>
              <td className="px-4 py-3.5 text-muted text-xs max-w-sm">{run.outcomeSummary}</td>
              <td className="px-4 py-3.5 text-muted text-xs">{run.source}</td>
              <td className="px-4 py-3.5 text-muted text-xs whitespace-nowrap">
                {formatLastUpdated(run.lastUpdated)}
              </td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  href={run.linkTarget}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  View
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
