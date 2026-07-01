import type {
  DemoExpectedOutcome,
  InboxEmail,
  InboxEmailMetadata,
} from "./types";

interface DemoInboxEmailMetadata extends InboxEmailMetadata {
  customerId: string;
  scenarioLabel: string;
  previewSignal: string;
  expectedOutcome: DemoExpectedOutcome;
}

export type DemoInboxEmail = Omit<InboxEmail, "source" | "metadata"> & {
  source: "demo";
  metadata: DemoInboxEmailMetadata;
};

export const demoInboxEmails: DemoInboxEmail[] = [
  {
    id: "email-clean-po",
    source: "demo",
    fromName: "Elena Torres",
    fromEmail: "elena.torres@arborlane.example",
    subject: "Repeat hoodie order for July event",
    bodyText: `Hi team,

Please repeat our navy Premium Pullover Hoodie order for the July partner event. This order is for PO-4821.

Quantity: 300 total
Color: Navy
Sizes: XS 12, S 42, M 84, L 84, XL 54, 2XL 24
Decoration: Left-chest embroidery using approved artwork AL-HOODIE-PRIMARY-V3
In-hands date: July 24, 2026
Ship to: Arbor Lane Co. Event Receiving, 1450 Foundry Way, Atlanta, GA 30318

Please send the confirmation to me. I am the requester and can answer any order questions.

Thank you,
Elena Torres
Events Operations Manager
(404) 555-0147`,
    receivedAt: "2026-06-29T09:12:00.000Z",
    status: "new",
    metadata: {
      customerId: "customer-arbor-lane",
      scenarioLabel: "Clean PO",
      previewSignal: "Complete repeat order with approved artwork",
      expectedOutcome: "completed",
    },
  },
  {
    id: "email-missing-data-po",
    source: "demo",
    fromName: "Drew Patel",
    fromEmail: "drew.patel@northridge.example",
    subject: "Rush caps order for field team",
    bodyText: `Hello,

We need a rush order of Structured Caps for the field team, delivered by Friday, July 3. We are still confirming the headcount, so please quote either 144 or 156 caps in charcoal.

Use embroidery, but I do not know which logo file is current. Can you check what you have on file? I also do not have the PO number yet; purchasing should send it tomorrow.

Ship to our Denver distribution center. Please let me know what you need from us to hold the date.

Drew Patel
Field Operations Coordinator`,
    receivedAt: "2026-06-29T09:36:00.000Z",
    status: "new",
    metadata: {
      customerId: "customer-north-ridge",
      scenarioLabel: "Missing data PO",
      previewSignal: "Rush request with no PO and uncertain quantity",
      expectedOutcome: "needs_review",
    },
  },
  {
    id: "email-artwork-change-po",
    source: "demo",
    fromName: "Priya Shah",
    fromEmail: "priya.shah@mapleworks.example",
    subject: "Tote reorder with artwork change",
    bodyText: `Hi,

We would like to reorder 500 Canvas Tote Bags based on previous order MW-3908. Please keep the natural canvas color and the same one-color screen-print placement.

There is one change: replace the old Maple Works wordmark with the revised artwork attached to this request (MW-WORDMARK-2026-DRAFT). Please send a proof for approval before production.

PO number: PO-MW-2046
Requested delivery: July 31, 2026
Ship to: Maple Works Studio, 88 Clay Street, Portland, OR 97209

Thanks,
Priya Shah
Studio Operations Lead`,
    receivedAt: "2026-06-29T10:08:00.000Z",
    status: "new",
    attachments: [
      {
        id: "attachment-maple-wordmark-draft",
        fileName: "MW-WORDMARK-2026-DRAFT.pdf",
        contentType: "application/pdf",
        sizeBytes: 428_160,
      },
    ],
    metadata: {
      customerId: "customer-maple-works",
      scenarioLabel: "Artwork/change review PO",
      previewSignal: "Reorder includes revised artwork requiring proof approval",
      expectedOutcome: "needs_review",
    },
  },
  {
    id: "email-risky-catalog-po",
    source: "demo",
    fromName: "Marcus Chen",
    fromEmail: "marcus.chen@cedarpeak.example",
    subject: "Legacy tote reorder for conference",
    bodyText: `Team,

Please reorder 400 Legacy Cotton Totes (SKU TOTE-LEGACY-10) from our conference order CP-1182. We need the same forest green screen print using artwork CP-SUMMIT-MARK-V2.

PO: PO-CP-7714
Required delivery: July 6, 2026
Ship to: Cedar Peak Events, Conference Receiving, 700 Summit Avenue, Seattle, WA 98104

I know this is a tight turnaround, but the conference freight pickup cannot move. Please flag any issue today.

Regards,
Marcus Chen
Conference Logistics Manager`,
    receivedAt: "2026-06-29T10:41:00.000Z",
    status: "new",
    metadata: {
      customerId: "customer-cedar-peak",
      scenarioLabel: "Risky/catalog issue PO",
      previewSignal: "Discontinued tote requested on a tight deadline",
      expectedOutcome: "blocked",
    },
  },
];

function copyInboxEmail(email: DemoInboxEmail): DemoInboxEmail {
  return {
    ...email,
    attachments: email.attachments?.map((attachment) => ({ ...attachment })),
    metadata: { ...email.metadata },
  };
}

export function getDemoInboxEmails(): DemoInboxEmail[] {
  return demoInboxEmails.map(copyInboxEmail);
}

export function getInboxEmailById(id: string): DemoInboxEmail | undefined {
  const email = demoInboxEmails.find((candidate) => candidate.id === id);
  return email ? copyInboxEmail(email) : undefined;
}

// Kept as a compatibility alias for callers created during the initial scaffold.
export const demoEmails = demoInboxEmails;

export function getDemoEmails(): DemoInboxEmail[] {
  return getDemoInboxEmails();
}
