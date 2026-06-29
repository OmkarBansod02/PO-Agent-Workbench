import Link from "next/link";
import { StatusBadge } from "../app/StatusBadge";

const queueItems = [
  {
    id: "run-arborlane-001",
    customer: "Arbor Lane Co.",
    subject: "Repeat hoodie order for July event",
    po: "PO-4821",
    status: "ready" as const,
    source: "Demo Inbox",
  },
  {
    id: "run-northridge-002",
    customer: "North Ridge Supply",
    subject: "Rush caps order for field team",
    po: "Missing PO",
    status: "blocked" as const,
    source: "Demo Inbox",
  },
  {
    id: "run-mapleworks-003",
    customer: "Maple Works Studio",
    subject: "Tote reorder with artwork change",
    po: "—",
    status: "needs_review" as const,
    source: "Demo Inbox",
  },
];

export function WorkQueueTable() {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Customer</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Subject</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">PO #</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Source</th>
          </tr>
        </thead>
        <tbody>
          {queueItems.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-foreground/[0.02] transition-colors">
              <td className="px-4 py-3">
                <Link href="/runs/demo-run" className="font-medium text-foreground hover:text-accent">
                  {item.customer}
                </Link>
              </td>
              <td className="px-4 py-3 text-foreground/80">{item.subject}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{item.po}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-muted text-xs">{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
