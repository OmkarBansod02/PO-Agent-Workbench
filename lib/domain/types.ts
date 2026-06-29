export type WorkflowRunStatus =
  | "ready"
  | "running"
  | "completed"
  | "blocked"
  | "needs_review"
  | "failed";

export type IntegrationStatus =
  | "not_started"
  | "pending"
  | "completed"
  | "failed";

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: number;
  steps: WorkflowStep[];
}

export interface ExtractedOrder {
  poNumber?: string;
  customerId?: string;
  catalogItemId?: string;
  quantity?: number;
  dueDate?: string;
  artworkReference?: string;
  shippingDestination?: string;
  sizeBreakdown?: Record<string, number>;
}

export interface ValidationIssue {
  id: string;
  code: string;
  message: string;
  severity: "warning" | "error";
  field?: keyof ExtractedOrder;
}

export interface WorkflowAction {
  id: string;
  type: string;
  label: string;
  status: IntegrationStatus;
  output?: Record<string, unknown>;
}

export interface TraceEvent {
  id: string;
  timestamp: string;
  step: string;
  status: WorkflowRunStatus;
  title: string;
  message: string;
  inputSummary?: string;
  outputSummary?: string;
  metadata?: Record<string, unknown>;
}

export interface Blocker {
  id: string;
  code: string;
  title: string;
  message: string;
  severity: "warning" | "error";
  field?: keyof ExtractedOrder;
}

export interface ApprovalGate {
  id: string;
  name: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  decidedAt?: string;
  decidedBy?: string;
}

export interface WorkflowRun {
  runId: string;
  definitionId: string;
  emailId: string;
  status: WorkflowRunStatus;
  intent?: string;
  extractedOrder?: ExtractedOrder;
  validations: ValidationIssue[];
  riskScore?: number;
  decision?: string;
  blockers: Blocker[];
  approvalGates: ApprovalGate[];
  actions: WorkflowAction[];
  draftEmail?: string;
  traceEvents: TraceEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStats {
  total: number;
  ready: number;
  running: number;
  completed: number;
  blocked: number;
  needsReview: number;
  failed: number;
}

export type RushApprovalPolicy =
  | "pre_approved"
  | "manual_review"
  | "not_allowed";

export type DecorationMethod =
  | "embroidery"
  | "screen_print"
  | "direct_to_garment"
  | "heat_transfer";

export type PreferredOrderSystem = "print_ops" | "merch_ops";

export interface Customer {
  id: string;
  name: string;
  emailDomains: string[];
  active: boolean;
  crmId: string;
  defaultShippingLocation: string;
  rushApprovalPolicy: RushApprovalPolicy;
  approvedArtworkRefs: string[];
  preferredDecorationMethod: DecorationMethod;
  preferredOrderSystem: PreferredOrderSystem;
}

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  category: "apparel" | "headwear" | "bags";
  active: boolean;
  requiresArtwork: boolean;
  supportedDecorationMethods: DecorationMethod[];
  discontinuedReason?: string;
}
