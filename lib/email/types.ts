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
  metadata?: Record<string, unknown>;
}
