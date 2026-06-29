import type {
  ExtractedOrder,
  IntegrationStatus,
} from "../domain/types";

export interface OrderSystemResult {
  status: IntegrationStatus;
  externalJobId?: string;
}

export interface CrmActivityInput {
  customerId: string;
  workflowRunId: string;
  summary: string;
  outcome: string;
}

export interface CrmActivityResult {
  status: IntegrationStatus;
  activityId?: string;
}

export interface OrderSystemAdapter {
  createJob(order: ExtractedOrder): Promise<OrderSystemResult>;
}

export interface CrmAdapter {
  logActivity(input: CrmActivityInput): Promise<CrmActivityResult>;
}
