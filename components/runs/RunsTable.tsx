import Link from "next/link";
import { StatusBadge } from "../app/StatusBadge";

const runs = [
  {
    id: "run-arborlane-001",
    customer: "Arbor Lane Co.",
    subject: "Repeat hoodie order for July event",
    status: "completed" as const,
    startedAt: "2025-06-28 09:14",
    duration: "4.2s",
  },
  {
    id: "run-northridge-002",
    customer: "North Ridge Supply",
    subject: "Rush caps order for field team",
    status: "blocked" as const,
    startedAt: "2025-06-28 10:31",
    duration: "2.8s",
  },
  {
    id: "run-mapleworks-003",
    customer: "Maple Works Studio",
    subject: "Tote reorder with artwork change",
    status: "needs_review" as const,
    startedAt: "2025-06-28 11:05",
    duration: "3.1s",
  },
];

export function RunsTable() {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Customer</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Subject</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Started</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Duration</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id} className="border-b border-border last:border-0 hover:bg-foreground/[0.02] transition-colors">
              <td className="px-4 py-3">
                <Link href="/runs/demo-run" className="font-medium text-foreground hover:text-accent">
                  {run.customer}
                </Link>
              </td>
              <td className="px-4 py-3 text-foreground/80">{run.subject}</td>
              <td className="px-4 py-3">
                <StatusBadge status={run.status} />
              </td>
              <td className="px-4 py-3 text-muted text-xs font-mono">{run.startedAt}</td>
              <td className="px-4 py-3 text-muted text-xs">{run.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
