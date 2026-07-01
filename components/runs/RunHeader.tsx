import Link from "next/link";
import { StatusBadge, type Status } from "../app/StatusBadge";

interface RunHeaderProps {
  customer: string;
  subject: string;
  status: Status;
  source: string;
  emailId: string;
  receivedAt: string;
}

function sourceLabel(source: string): string {
  if (source === "demo") return "Demo Inbox";
  if (source === "agentmail") return "AgentMail";
  return source;
}

export function RunHeader({
  customer,
  subject,
  status,
  source,
  emailId,
  receivedAt,
}: RunHeaderProps) {
  return (
    <div className="border border-border rounded-lg bg-surface px-5 py-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Link
          href="/work-queue"
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          &larr; Work Queue
        </Link>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {customer}
          </h2>
          <p className="text-sm text-muted mt-0.5">{subject}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted">
        <span>Source: {sourceLabel(source)}</span>
        <span className="text-border">&middot;</span>
        <span>
          Email: <span className="font-mono">{emailId}</span>
        </span>
        <span className="text-border">&middot;</span>
        <span>Received: {receivedAt}</span>
      </div>
    </div>
  );
}
