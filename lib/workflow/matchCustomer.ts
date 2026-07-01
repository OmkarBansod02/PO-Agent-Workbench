import { mockCustomers } from "../domain/mockCustomers";
import type { Customer, ExtractedOrder } from "../domain/types";

export interface CustomerMatch {
  customer?: Customer;
  matchedBy?: "customer_id" | "name" | "email_domain";
}

interface MatchCustomerInput {
  customerId?: string;
  extractedOrder: ExtractedOrder;
  rawEmail: string;
}

export function matchCustomer(input: MatchCustomerInput): CustomerMatch {
  if (input.customerId) {
    const customer = mockCustomers.find(({ id }) => id === input.customerId);
    if (customer) return { customer, matchedBy: "customer_id" };
  }

  const customerName = input.extractedOrder.customerName?.trim().toLowerCase();
  if (customerName) {
    const customer = mockCustomers.find(
      ({ name }) => name.toLowerCase() === customerName,
    );
    if (customer) return { customer, matchedBy: "name" };
  }

  const searchableEmail = `${input.extractedOrder.requesterEmail ?? ""} ${input.rawEmail}`.toLowerCase();
  const customer = mockCustomers.find(({ emailDomains }) =>
    emailDomains.some((domain) => searchableEmail.includes(`@${domain}`)),
  );

  return customer
    ? { customer, matchedBy: "email_domain" }
    : { customer: undefined };
}
