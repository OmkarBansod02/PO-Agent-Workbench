import type { WorkflowDefinition } from "./types";

export const poIntakeWorkflowDefinition: WorkflowDefinition = {
  id: "po-intake",
  name: "Purchase order intake",
  description: "Extract, validate, route, and prepare purchase order actions.",
  version: 1,
  steps: [
    {
      id: "email_received",
      name: "Email received",
      description: "Accept a normalized inbox email for processing.",
    },
    {
      id: "order_extracted",
      name: "Order extracted",
      description: "Extract structured purchase order fields.",
    },
    {
      id: "validation_completed",
      name: "Validation completed",
      description: "Apply deterministic customer, catalog, and business rules.",
    },
    {
      id: "route_decided",
      name: "Route decided",
      description: "Choose safe execution or human review.",
    },
    {
      id: "actions_prepared",
      name: "Actions prepared",
      description: "Prepare downstream order, CRM, and email actions.",
    },
  ],
};

export const workflowDefinitions: WorkflowDefinition[] = [
  poIntakeWorkflowDefinition,
];
