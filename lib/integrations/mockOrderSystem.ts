import type { ExtractedOrder } from "../domain/types";
import type { OrderSystemResult } from "./adapters";

export async function createMockOrderJob(
  order: ExtractedOrder,
): Promise<OrderSystemResult> {
  void order;
  // TODO: Store and return a mock order-management job in a later phase.
  throw new Error("TODO: Implement the mock order system adapter.");
}
