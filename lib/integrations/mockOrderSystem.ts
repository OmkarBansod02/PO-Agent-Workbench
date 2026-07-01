import { createId } from "../utils/ids";
import type { CreateOrderJobInput, OrderJobPayload } from "./adapters";

export async function createMockOrderJob(
  input: CreateOrderJobInput,
): Promise<OrderJobPayload> {
  return {
    jobId: createId("job"),
    customerId:
      input.order.customerId ?? input.customer?.id ?? "customer-unmatched",
    customerName:
      input.order.customerName ?? input.customer?.name ?? "Unmatched customer",
    poNumber: input.order.poNumber,
    productName: input.order.productName,
    quantity: input.order.quantity,
    color: input.order.color,
    sizeBreakdown: input.order.sizeBreakdown,
    dueDate: input.order.dueDate,
    artworkReference: input.order.artworkReference,
    shippingLocation: input.order.shippingLocation,
    sourceEmailId: input.sourceEmailId,
  };
}
