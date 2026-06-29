import type { Customer } from "./types";

export const mockCustomers: Customer[] = [
  {
    id: "customer-arbor-lane",
    name: "Arbor Lane Co.",
    emailDomains: ["arborlane.example"],
    active: true,
    crmId: "CRM-AL-1042",
    defaultShippingLocation:
      "Arbor Lane Co. Event Receiving, 1450 Foundry Way, Atlanta, GA 30318",
    rushApprovalPolicy: "pre_approved",
    approvedArtworkRefs: ["AL-HOODIE-PRIMARY-V3", "AL-EVENT-MARK-V2"],
    preferredDecorationMethod: "embroidery",
    preferredOrderSystem: "print_ops",
  },
  {
    id: "customer-north-ridge",
    name: "North Ridge Supply",
    emailDomains: ["northridge.example"],
    active: true,
    crmId: "CRM-NR-2387",
    defaultShippingLocation:
      "North Ridge Supply Distribution, 4600 Blake Street, Denver, CO 80216",
    rushApprovalPolicy: "manual_review",
    approvedArtworkRefs: ["NR-MOUNTAIN-LOGO-V4", "NR-FIELD-TEAM-V2"],
    preferredDecorationMethod: "embroidery",
    preferredOrderSystem: "merch_ops",
  },
  {
    id: "customer-maple-works",
    name: "Maple Works Studio",
    emailDomains: ["mapleworks.example"],
    active: true,
    crmId: "CRM-MW-3164",
    defaultShippingLocation:
      "Maple Works Studio, 88 Clay Street, Portland, OR 97209",
    rushApprovalPolicy: "manual_review",
    approvedArtworkRefs: ["MW-WORDMARK-2025-FINAL", "MW-MAKER-MARK-V3"],
    preferredDecorationMethod: "screen_print",
    preferredOrderSystem: "print_ops",
  },
  {
    id: "customer-cedar-peak",
    name: "Cedar Peak Events",
    emailDomains: ["cedarpeak.example"],
    active: true,
    crmId: "CRM-CP-4091",
    defaultShippingLocation:
      "Cedar Peak Events, Conference Receiving, 700 Summit Avenue, Seattle, WA 98104",
    rushApprovalPolicy: "manual_review",
    approvedArtworkRefs: ["CP-SUMMIT-MARK-V2", "CP-CONFERENCE-LOCKUP-V5"],
    preferredDecorationMethod: "screen_print",
    preferredOrderSystem: "merch_ops",
  },
];

export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find((customer) => customer.id === id);
}
