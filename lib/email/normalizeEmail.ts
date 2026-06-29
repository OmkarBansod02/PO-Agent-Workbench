import type { InboxEmail } from "./types";

export type RawEmailInput = Omit<InboxEmail, "bodyText"> & {
  bodyText?: string;
  bodyHtml?: string;
};

export function normalizeEmail(email: RawEmailInput): InboxEmail {
  return {
    id: email.id,
    source: email.source,
    fromName: email.fromName,
    fromEmail: email.fromEmail.trim().toLowerCase(),
    subject: email.subject.trim(),
    bodyText: email.bodyText?.trim() ?? "",
    receivedAt: email.receivedAt,
    status: email.status,
    attachments: email.attachments,
    metadata: email.metadata,
  };
}
