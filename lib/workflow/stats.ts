import type { WorkflowRun, WorkflowStats } from "../domain/types";

export function calculateWorkflowStats(runs: WorkflowRun[]): WorkflowStats {
  return {
    total: runs.length,
    ready: runs.filter((run) => run.status === "ready").length,
    running: runs.filter((run) => run.status === "running").length,
    completed: runs.filter((run) => run.status === "completed").length,
    blocked: runs.filter((run) => run.status === "blocked").length,
    needsReview: runs.filter((run) => run.status === "needs_review").length,
    failed: runs.filter((run) => run.status === "failed").length,
  };
}
