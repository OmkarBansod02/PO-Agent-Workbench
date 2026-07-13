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
    name: "Demo Inbox",
    category: "email_intake",
    status: "connected",
    mode: "Local sample data",
    description:
      "Loads representative purchase order emails from local demo fixtures.",
    safetyNote:
      "No external mailbox is read; demo metadata is only used for local navigation and summaries.",
  },
  {
    id: "agentmail",
    name: "AgentMail",
    category: "ai_mailbox",
    status: "not_configured",
    mode: "Disabled",
    description:
      "Reserved intake boundary for a future production email source.",
    safetyNote:
      "No AgentMail calls are made in this demo and no credentials are required.",
  },
  {
    id: "order-system",
    name: "Order System",
    category: "order_management",
    status: "simulated",
    mode: "Simulated adapter active",
    description:
      "Prepares mock print or merchandise job payloads after deterministic validation passes.",
    safetyNote:
      "The adapter returns local mock job records and never writes to a real order system.",
  },
  {
    id: "crm",
    name: "CRM",
    category: "crm",
    status: "simulated",
    mode: "Simulated adapter active",
    description:
      "Prepares mock CRM activity payloads linked to workflow run identifiers.",
    safetyNote:
      "The adapter creates local mock activity records only; no CRM API is called.",
  },
  {
    id: "customer-reply",
    name: "Customer Reply",
    category: "customer_communication",
    status: "draft_only",
    mode: "Draft-only mode",
    description:
      "Generates confirmation or clarification reply drafts for operator review.",
    safetyNote:
      "Replies are never sent automatically; every generated message stays draft-only.",
  },
];

export function getIntegrationStatuses(): IntegrationStatusSummary[] {
  return integrationStatuses.map((integration) => ({ ...integration }));
}
