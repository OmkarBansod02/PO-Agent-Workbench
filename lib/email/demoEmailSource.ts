import type { InboxEmail } from "./types";

export const demoEmails: InboxEmail[] = [
  {
    id: "email-clean-po",
    source: "demo",
    fromName: "Morgan Lee",
    fromEmail: "morgan@arborlane.example",
    subject: "PO 1048 - Classic tees",
    bodyText:
      "Please produce 120 classic tees for delivery on 2026-07-24. Artwork: AL-SUMMER-26. Ship to our main office.",
    receivedAt: "2026-06-29T09:00:00.000Z",
    status: "new",
  },
  {
    id: "email-missing-data-po",
    source: "demo",
    fromName: "Casey Brooks",
    fromEmail: "casey@summitfield.example",
    subject: "New shirt order",
    bodyText: "We need another batch of company shirts. Please use our usual logo.",
    receivedAt: "2026-06-29T09:05:00.000Z",
    status: "new",
  },
  {
    id: "email-risky-po",
    source: "demo",
    fromName: "Morgan Lee",
    fromEmail: "morgan@arborlane.example",
    subject: "Urgent PO 1051",
    bodyText:
      "Please rush 75 legacy hoodies for delivery this week. Artwork: AL-WINTER-25.",
    receivedAt: "2026-06-29T09:10:00.000Z",
    status: "new",
  },
];

export function getDemoEmails(): InboxEmail[] {
  return demoEmails.map((email) => ({ ...email }));
}
