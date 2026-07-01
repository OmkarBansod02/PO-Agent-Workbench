import type {
  CrmActivityInput,
  CrmActivityPayload,
} from "./adapters";
import { createId } from "../utils/ids";

export async function logMockCrmActivity(
  input: CrmActivityInput,
): Promise<CrmActivityPayload> {
  return {
    activityId: createId("crm_activity"),
    customerId: input.customerId,
    type: input.type,
    summary: `${input.summary} Outcome: ${input.outcome}.`,
    linkedWorkflowRunId: input.workflowRunId,
    linkedEmailId: input.emailId,
  };
}
