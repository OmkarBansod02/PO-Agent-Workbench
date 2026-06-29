import type { Customer } from "./types";

export const mockCustomers: Customer[] = [
  {
    id: "customer-arbor-lane",
    name: "Arbor Lane Co.",
    emailDomains: ["arborlane.example"],
    active: true,
    requiresManualApproval: false,
  },
  {
    id: "customer-summit-field",
    name: "Summit Field Supply",
    emailDomains: ["summitfield.example"],
    active: true,
    requiresManualApproval: true,
  },
];
