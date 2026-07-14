import Link from "next/link";
import { StatusBadge } from "../app/StatusBadge";
import { getCustomerById } from "@/lib/domain/mockCustomers";
import type { DemoInboxEmail } from "@/lib/email/demoEmailSource";

function resolveCustomerName(email: DemoInboxEmail): string {
  const customer = getCustomerById(email.metadata.customerId);
  return customer?.name ?? email.fromName;
}

function formatReceivedAt(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function sourceLabel(source: string): string {
  if (source === "demo") return "Inbox";
  if (source === "agentmail") return "AgentMail";
  return source;
}

interface WorkQueueTableProps {
  emails: DemoInboxEmail[];
}

export function WorkQueueTable({ emails }: WorkQueueTableProps) {
  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface px-6 py-12 text-center shadow-sm">
        <p className="text-sm text-muted">No emails in the work queue.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-surface overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">
              Customer
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">
              Subject
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">
              Signal
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">
              Status
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">
              Source
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted text-xs">
              Received
            </th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => {
            const href = `/runs/${email.id}`;

            return (
              <tr
                key={email.id}
                className="border-b border-border/40 last:border-0 hover:bg-accent/[0.03] transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3">
                  <Link
                    href={href}
                    className="font-medium text-foreground group-hover:text-accent transition-colors"
                  >
                    {resolveCustomerName(email)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/80 max-w-xs truncate">
                  <Link
                    href={href}
                    className="hover:text-foreground transition-colors"
                  >
                    {email.subject}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {email.metadata.previewSignal}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={email.status} />
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {sourceLabel(email.source)}
                </td>
                <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                  {formatReceivedAt(email.receivedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
