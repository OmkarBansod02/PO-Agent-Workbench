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

export type IntegrationCategory =
  | "email_intake"
  | "ai_mailbox"
  | "order_management"
  | "crm"
  | "customer_communication";

export type IntegrationConnectionStatus =
  | "connected"
  | "not_configured"
  | "simulated"
  | "draft_only";

export interface IntegrationStatusSummary {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationConnectionStatus;
  mode: string;
  description: string;
  safetyNote: string;
}

export const integrationStatuses: IntegrationStatusSummary[] = [
  {
    id: "demo-inbox",
    name: "Inbox",
    category: "email_intake",
    status: "connected",
    mode: "Connected — local data source",
    description:
      "Loads purchase order emails and makes them available as workflow inputs.",
    safetyNote:
      "Currently connected to a local data source. Can be replaced with a live mailbox adapter in production.",
  },
  {
    id: "agentmail",
    name: "AgentMail",
    category: "ai_mailbox",
    status: "not_configured",
    mode: "Not configured",
    description:
      "Reserved integration boundary for a production email intake source.",
    safetyNote:
      "No credentials are configured and no external calls are made.",
  },
  {
    id: "order-system",
    name: "Order System",
    category: "order_management",
    status: "simulated",
    mode: "Simulated adapter active",
    description:
      "Prepares print or merchandise job payloads after deterministic validation passes.",
    safetyNote:
      "Returns local job records. In production, this adapter connects to an order management system.",
  },
  {
    id: "crm",
    name: "CRM",
    category: "crm",
    status: "simulated",
    mode: "Simulated adapter active",
    description:
      "Logs activity payloads linked to workflow runs and customer records.",
    safetyNote:
      "Creates local activity records only. In production, this adapter connects to a CRM platform.",
  },
  {
    id: "customer-reply",
    name: "Customer Reply",
    category: "customer_communication",
    status: "draft_only",
    mode: "Draft-only mode",
    description:
      "Generates confirmation or clarification reply drafts for operator review before sending.",
    safetyNote:
      "Replies are never sent automatically. Every generated message stays draft-only until operator approval.",
  },
];

export function getIntegrationStatuses(): IntegrationStatusSummary[] {
  return integrationStatuses.map((integration) => ({ ...integration }));
}
