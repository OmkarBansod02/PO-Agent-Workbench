import { RunDetailPage } from "@/components/runs/RunDetailPage";

export default async function RunDetailRoute({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <RunDetailPage emailId={runId} />;
}
