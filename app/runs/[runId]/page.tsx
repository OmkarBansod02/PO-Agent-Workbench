import { getInboxEmailById } from "@/lib/email/demoEmailSource";
import { runPOWorkflow } from "@/lib/workflow/runWorkflow";
import {
  RunDetailPage,
  RunDetailNotFound,
} from "@/components/runs/RunDetailPage";

export default async function RunDetailRoute({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;

  const email = getInboxEmailById(runId);
  if (!email) {
    return <RunDetailNotFound emailId={runId} />;
  }

  const workflowRun = await runPOWorkflow({
    emailId: email.id,
    rawEmail: email.bodyText,
    source: email.source,
    customerId: email.metadata.customerId,
  });

  return <RunDetailPage email={email} workflowRun={workflowRun} />;
}
