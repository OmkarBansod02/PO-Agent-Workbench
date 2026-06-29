import type { InboxEmail } from "./types";

export interface AgentMailEmailSource {
  listEmails(): Promise<InboxEmail[]>;
}

export async function listAgentMailEmails(): Promise<InboxEmail[]> {
  // TODO: Connect an AgentMail adapter in a later phase.
  return [];
}
