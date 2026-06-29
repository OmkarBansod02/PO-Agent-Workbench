import Link from "next/link";
import { StatusBadge } from "../app/StatusBadge";
import { getDemoInboxEmails } from "@/lib/email/demoEmailSource";
import { getCustomerById } from "@/lib/domain/mockCustomers";
import type { InboxEmail } from "@/lib/email/types";

function extractPoNumber(email: InboxEmail): string | null {
  const poField = email.metadata?.poNumber;
  if (typeof poField === "string") return poField;

  const match = email.bodyText.match(/\bPO[-‑–]?\s*(\w[\w-]*\w)/i);
  return match ? match[0] : null;
}

function resolveCustomerName(email: InboxEmail): string {
  const customerId = email.metadata?.customerId;
  if (typeof customerId === "string") {
    const customer = getCustomerById(customerId);
    if (customer) return customer.name;
  }
  return email.fromName;
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
  if (source === "demo") return "Demo Inbox";
  if (source === "agentmail") return "AgentMail";
  return source;
}

export function WorkQueueTable() {
  const emails = getDemoInboxEmails();

  if (emails.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">No emails in the work queue.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Customer</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Subject</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Signal / PO #</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Source</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted text-xs">Received</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => {
            const customerName = resolveCustomerName(email);
            const po = extractPoNumber(email);
            const scenario = email.metadata?.scenarioLabel;
            const signal = po ?? (typeof scenario === "string" ? scenario : "—");

            return (
              <tr
                key={email.id}
                className="border-b border-border last:border-0 hover:bg-foreground/[0.03] transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/runs/${email.id}`}
                    className="font-medium text-foreground group-hover:text-accent transition-colors"
                  >
                    {customerName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/80 max-w-xs truncate">
                  <Link href={`/runs/${email.id}`} className="hover:text-foreground transition-colors">
                    {email.subject}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{signal}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={email.status} />
                </td>
                <td className="px-4 py-3 text-muted text-xs">{sourceLabel(email.source)}</td>
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
