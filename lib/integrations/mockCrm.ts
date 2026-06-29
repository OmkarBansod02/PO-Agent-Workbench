import type {
  CrmActivityInput,
  CrmActivityResult,
} from "./adapters";

export async function logMockCrmActivity(
  input: CrmActivityInput,
): Promise<CrmActivityResult> {
  void input;
  // TODO: Store and return a mock CRM activity in a later phase.
  throw new Error("TODO: Implement the mock CRM adapter.");
}
