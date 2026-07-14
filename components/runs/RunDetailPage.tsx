import Link from "next/link";
import type { WorkflowRun } from "@/lib/domain/types";
import type { InboxEmail } from "@/lib/email/types";
import { RunWorkspaceClient } from "./RunWorkspaceClient";

interface RunDetailPageProps {
  email: InboxEmail;
  workflowRun: WorkflowRun;
}

export function RunDetailPage({ email, workflowRun }: RunDetailPageProps) {
  return <RunWorkspaceClient email={email} initialWorkflowRun={workflowRun} />;
}

export function RunDetailNotFound({ emailId }: { emailId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="rounded-xl border border-border/80 bg-surface px-8 py-10 text-center max-w-md shadow-sm">
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
