import type { WorkflowRun } from "../domain/types";

export interface RunPOWorkflowInput {
  emailId: string;
  customerId?: string;
  rawEmail: string;
  mode?: "deterministic" | "llm";
}

export function runPOWorkflow(_input: RunPOWorkflowInput): WorkflowRun {
  void _input;
  throw new Error("TODO: Implement the purchase order workflow.");
}
