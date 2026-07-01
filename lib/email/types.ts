export type EmailSourceType = "demo" | "agentmail";

export type EmailProcessingStatus =
  | "new"
  | "queued"
  | "processing"
  | "processed"
  | "blocked";

export interface EmailAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export type DemoExpectedOutcome = "completed" | "needs_review" | "blocked";

export interface InboxEmailMetadata {
  customerId?: string;
  scenarioLabel?: string;
  previewSignal?: string;
  /** Demo-only expectation for the UI; workflow routing must not read this value. */
  expectedOutcome?: DemoExpectedOutcome;
  [key: string]: unknown;
}

export interface InboxEmail {
  id: string;
  source: EmailSourceType;
  fromName: string;
  fromEmail: string;
  subject: string;
  bodyText: string;
  receivedAt: string;
  status: EmailProcessingStatus;
  attachments?: EmailAttachment[];
  metadata?: InboxEmailMetadata;
}
