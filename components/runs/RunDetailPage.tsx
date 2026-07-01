import Link from "next/link";
import { getInboxEmailById } from "@/lib/email/demoEmailSource";
import { getCustomerById } from "@/lib/domain/mockCustomers";
import { RunHeader } from "./RunHeader";
import { RunSectionCard } from "./RunSectionCard";

interface RunDetailPageProps {
  emailId: string;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

export function RunDetailPage({ emailId }: RunDetailPageProps) {
  const email = getInboxEmailById(emailId);

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="border border-border rounded-lg bg-surface px-8 py-10 text-center max-w-md">
          <h2 className="text-base font-semibold text-foreground mb-2">
            Email not found
          </h2>
          <p className="text-sm text-muted mb-6">
            No inbox email matches the id{" "}
            <span className="font-mono text-xs">{emailId}</span>.
          </p>
          <Link
            href="/work-queue"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            Back to Work Queue
          </Link>
        </div>
      </div>
    );
  }

  const customer = getCustomerById(email.metadata.customerId);
  const customerName = customer?.name ?? email.fromName;

  return (
    <div>
      <RunHeader
        customer={customerName}
        subject={email.subject}
        status={email.status}
        emailId={email.id}
        receivedAt={formatDateTime(email.receivedAt)}
      />

      <div className="flex items-center gap-3 mb-5 text-xs text-muted">
        <span>Source: {sourceLabel(email.source)}</span>
        <span className="text-border">·</span>
        <span>
          From: {email.fromName} &lt;{email.fromEmail}&gt;
        </span>
        <span className="text-border">·</span>
        <span>Received: {formatDateTime(email.receivedAt)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RunSectionCard title="Original Email">
          <div className="space-y-2 text-foreground/80">
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>
                From: {email.fromName} &lt;{email.fromEmail}&gt;
              </span>
            </div>
            <div className="text-xs text-muted">Subject: {email.subject}</div>
            <pre className="mt-3 whitespace-pre-wrap leading-relaxed text-sm font-sans text-foreground/80">
              {email.bodyText}
            </pre>
          </div>
        </RunSectionCard>

        <RunSectionCard title="Extracted Order">
          <PendingSection message="Run the workflow in the next phase to extract order details." />
        </RunSectionCard>

        <RunSectionCard title="Validation & Blockers">
          <PendingSection message="Validation runs after order details are extracted." />
        </RunSectionCard>

        <RunSectionCard title="Actions">
          <PendingSection message="Actions are prepared after validation passes." />
        </RunSectionCard>

        <RunSectionCard title="Draft Reply">
          <PendingSection message="A customer reply is drafted after actions are prepared." />
        </RunSectionCard>

        <RunSectionCard title="Audit Trace">
          <PendingSection message="The audit trace populates as each workflow step executes." />
        </RunSectionCard>
      </div>
    </div>
  );
}

function PendingSection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-8 h-8 rounded-full bg-foreground/[0.04] flex items-center justify-center mb-3">
        <div className="w-2 h-2 rounded-full bg-foreground/20" />
      </div>
      <p className="text-xs text-muted">{message}</p>
    </div>
  );
}
