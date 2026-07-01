import type {
  Customer,
  ExtractedOrder,
} from "../domain/types";

export interface OrderJobPayload {
  jobId: string;
  customerId: string;
  customerName: string;
  poNumber?: string;
  productName?: string;
  quantity?: number;
  color?: string;
  sizeBreakdown?: Record<string, number>;
  dueDate?: string;
  artworkReference?: string;
  shippingLocation?: string;
  sourceEmailId: string;
}

export interface CreateOrderJobInput {
  runId: string;
  sourceEmailId: string;
  order: ExtractedOrder;
  customer?: Customer;
}

export interface CrmActivityPayload {
  activityId: string;
  customerId: string;
  type: string;
  summary: string;
  linkedWorkflowRunId: string;
  linkedEmailId: string;
}

export interface CrmActivityInput {
  customerId: string;
  workflowRunId: string;
  emailId: string;
  type: string;
  summary: string;
  outcome: string;
}

export interface OrderSystemAdapter {
  createJob(input: CreateOrderJobInput): Promise<OrderJobPayload>;
}

export interface CrmAdapter {
  logActivity(input: CrmActivityInput): Promise<CrmActivityPayload>;
}
