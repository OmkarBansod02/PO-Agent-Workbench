import type { ApprovalGate } from "../domain/types";
import { createId } from "../utils/ids";

export type CreateApprovalGateInput = Omit<ApprovalGate, "id" | "status"> & {
  id?: string;
  status?: ApprovalGate["status"];
};

export function createApprovalGate(
  input: CreateApprovalGateInput,
): ApprovalGate {
  return {
    ...input,
    id: input.id ?? createId("approval"),
    status: input.status ?? "pending",
  };
}
