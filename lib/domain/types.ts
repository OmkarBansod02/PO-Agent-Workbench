export type WorkflowRunStatus =
  | "ready"
  | "running"
  | "completed"
  | "blocked"
  | "needs_review"
  | "failed";

export type PurchaseOrderIntent =
  | "new_order"
  | "reorder"
  | "order_change"
  | "unclear";

export type ExtractionMethod = "ai" | "fallback";

export type RouteDecision = "completed" | "needs_review" | "blocked";

export type IntegrationStatus =
  | "not_started"
  | "pending"
  | "completed"
  | "failed";

export type WorkflowActionType =
  | "order_job"
  | "crm_activity"
  | "review_task"
  | "reply_draft";

export type WorkflowActionStatus = "prepared" | "skipped" | "blocked";

export type ReplyDraftType =
  | "confirmation"
  | "clarification"
  | "review_required";

export interface ReplyDraft {
  subject: string;
  body: string;
  tone: "professional";
  draftType: ReplyDraftType;
  method: ExtractionMethod;
}

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
  customerName?: string;
  requesterName?: string;
  requesterEmail?: string;
  poNumber?: string;
  productName?: string;
  color?: string;
  customerId?: string;
  catalogItemId?: string;
  quantity?: number;
  dueDate?: string;
  artworkReference?: string;
  shippingLocation?: string;
  sizeBreakdown?: Record<string, number>;
  notes?: string;
}

export interface HumanReviewApprovals {
  rushApproved?: boolean;
  artworkChangeApproved?: boolean;
  customerConfirmed?: boolean;
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
  type: WorkflowActionType;
  status: WorkflowActionStatus;
  title: string;
  summary: string;
  payload: Record<string, unknown>;
  createdAt: string;
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
  blocksProgress: boolean;
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
  source: "demo" | "agentmail";
  status: WorkflowRunStatus;
  intent: PurchaseOrderIntent;
  extractedOrder: ExtractedOrder;
  extractionMethod: ExtractionMethod;
  aiModel?: string;
  aiConfidence: number;
  uncertainFields: string[];
  validationIssues: ValidationIssue[];
  riskScore: number;
  routeDecision: RouteDecision;
  blockers: Blocker[];
  approvalGates: ApprovalGate[];
  actions: WorkflowAction[];
  draftReply?: ReplyDraft;
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
