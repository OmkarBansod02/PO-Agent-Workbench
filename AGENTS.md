# AGENTS.md

## Project Name

PO Agent Workbench

## Public Positioning

PO Agent Workbench is a B2B operations workflow runner for messy purchase order intake.

It turns unstructured customer purchase order emails into structured, validated, reviewable workflow runs with mock downstream actions and a full audit trace.

This project should be reusable as a proof-of-work project for AI workflow, B2B operations automation, agent orchestration, and full-stack product engineering roles.

Do not name or reference any specific target company in the product UI, README, code comments, or public-facing materials.

## Goal

Build a realistic proof-of-work project that demonstrates:

* Systems thinking
* Workflow orchestration
* AI-assisted structured extraction
* Deterministic business validation
* Human-in-the-loop escalation
* Mock integration boundaries
* Auditability and traceability
* Multi-customer configuration awareness
* Fast, practical product execution

The goal is not to build a chatbot.

The goal is to build an operations workbench where an agent-like workflow processes messy business inputs, validates them, safely executes actions, and escalates exceptions to humans.

## Core Workflow

Messy customer purchase order email
→ classify intent
→ extract structured order details
→ look up customer/catalog/business rules
→ validate missing/conflicting/risky fields
→ route risky cases to human review
→ create a mock print/order-management job
→ draft customer confirmation or clarification email
→ log mock CRM activity
→ show a trace/audit timeline of every workflow step

## Product Principle

Build a workflow cockpit, not a chatbot.

The UI should feel like an operations control room where a human operator can see:

* What came in
* What the system understood
* What rules passed or failed
* What actions were taken
* What needs human review
* What was written to downstream systems
* Why each decision happened

## What This Project Is

A local demo app that simulates how an AI-enabled operations system handles print/promotional merchandise purchase orders.

It should include:

* Mock inbox with customer PO emails
* Structured extraction result
* Customer and catalog lookup
* Business rule validation
* Confidence/risk scoring
* Human review queue
* Mock order/job creation
* Mock CRM activity logging
* Draft customer email
* Full trace timeline

## What This Project Is Not

Do not build:

* A generic chatbot
* A full enterprise workflow builder
* A drag-and-drop automation builder
* Real Gmail OAuth
* Real CRM integration
* Real Printavo/ShopWorks integration
* Auth
* Billing
* Multi-user permissions
* Complex database schema in v1
* Voice/SMS/chat channels in v1
* Pixel-perfect SaaS landing page

## Tech Stack

Use:

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* shadcn/ui only where useful
* Mock data first
* In-memory or file-backed data first

Avoid:

* Database in Phase 0
* Auth
* External APIs
* LLM dependency in v1
* Unnecessary packages

LLM extraction can be added later, but deterministic fallback is required.

## Architecture Direction

Keep the backend/domain logic separate from the UI.

Recommended structure:

app/
page.tsx
layout.tsx
api/
workflow/
run/route.ts
review/route.ts

components/
workbench/
AppShell.tsx
Header.tsx
InboxPanel.tsx
EmailViewer.tsx
ExtractedOrderCard.tsx
ValidationPanel.tsx
HumanReviewPanel.tsx
ActionsPanel.tsx
DraftEmailPanel.tsx
TraceTimeline.tsx
CustomerConfigPanel.tsx

lib/
domain/
types.ts
sampleEmails.ts
mockCustomers.ts
mockCatalog.ts
mockRules.ts
workflow/
runWorkflow.ts
classifyIntent.ts
extractOrder.ts
validateOrder.ts
scoreRisk.ts
routeDecision.ts
executeActions.ts
generateDraftEmail.ts
applyHumanReview.ts
trace.ts
integrations/
mockPrintJobSystem.ts
mockCrm.ts
utils/
ids.ts
dates.ts

## Workflow Engine Contract

The main workflow function should look roughly like:

runPOWorkflow(input: {
emailId: string
customerId?: string
rawEmail: string
mode?: "deterministic" | "llm"
}): WorkflowRun

WorkflowRun should include:

* runId
* status: "completed" | "needs_review" | "failed"
* intent
* extractedOrder
* validations
* riskScore
* decision
* actions
* draftEmail
* traceEvents
* createdAt

## Demo Scenarios

Include at least 3 sample emails:

1. Clean PO
   Should auto-create mock job, log CRM activity, and draft confirmation email.

2. Missing data PO
   Should extract partial details, fail validation, and route to human review.

3. Risky/conflicting PO
   Should detect conflict, rush deadline, discontinued item, or uncertainty and route to human review.

Optional 4th:

4. Repeat order using prior customer context.

## Validation Rules

Include deterministic validation rules such as:

* PO number is required
* Customer must be recognized
* Quantity must be present
* Due date must be present
* Due date cannot be too soon without rush review
* Product must exist in catalog
* Product must be active
* Size breakdown should match quantity if provided
* Artwork reference is required for decorated apparel
* Shipping destination is required
* Rush orders require human review
* Discontinued catalog item requires human review

## Human Review Rules

A workflow should move to human review when:

* Required fields are missing
* Fields conflict
* Product is unknown or discontinued
* Due date is risky
* Confidence is below threshold
* Validation fails
* Business rule says manual approval required

Human review should not feel like failure. It should feel like safe workflow design.

## Mock Integrations

Mock print/order-management job creation:

* create job id
* store customer
* line items
* due date
* decoration details
* status

Mock CRM logging:

* create activity id
* customer id
* summary
* outcome
* linked workflow run id

Mock email draft:

* confirmation email if completed
* clarification email if needs review

## Trace Timeline

Every important step must create a trace event.

Trace event fields:

* id
* timestamp
* step
* status
* title
* message
* inputSummary?
* outputSummary?
* metadata?

Example steps:

* email_received
* intent_classified
* order_extracted
* customer_lookup
* catalog_lookup
* validation_completed
* risk_scored
* route_decided
* job_created
* crm_activity_logged
* email_draft_generated
* human_review_requested

The trace is one of the most important parts of the project. It proves auditability and systems thinking.

## UI Requirements

The main page should show:

Left:

* Mock inbox
* List of sample customer PO emails
* Status badge for each run

Center:

* Selected email
* Extracted structured order
* Validation results
* Human review block when needed

Right:

* Workflow trace timeline
* Actions taken
* Draft customer email
* Mock integration results

The user should be able to:

* Select a sample email
* Run workflow
* See result
* Review/fix fields for a needs-review case
* Approve and create job after review

## Design Style

The product should feel like a B2B operations tool:

* Dense but readable
* Practical
* Trustworthy
* More Linear/Retool/ops dashboard than flashy AI app
* No unnecessary animations
* No fake marketing copy in the core app

Use clear labels:

* Needs human review
* Validation failed
* Job created
* CRM logged
* Draft ready
* Trace

## Code Quality Rules

* TypeScript strictness matters
* Prefer explicit domain types
* Keep workflow logic testable and UI-independent
* Avoid magical global state
* Avoid over-abstracting
* Avoid installing unnecessary packages
* Do not introduce a database before the core workflow works
* Keep functions small and named around business meaning
* Mock integrations should look like real adapter boundaries 

## First Screen Rule

A user should understand the product within 15–20 seconds.

The first screen must clearly communicate:
- This is a purchase order intake workflow app
- Incoming emails become workflow runs
- The system extracts and validates order details
- Risky/missing data becomes blockers
- Safe actions prepare order jobs, CRM activity, and customer replies
- Every run has an audit trace

Do not make the UI feel like a test dashboard, mock playground, or chatbot.

## README Must Explain

* Why this project exists
* Core workflow
* Architecture
* Mock integration boundaries
* AI vs deterministic rule design
* Human-in-the-loop design
* Trace/audit design
* Multi-customer config
* Tradeoffs
* What would be next in production

## Sprint Rule

Always choose the simplest thing that increases proof-of-work signal.

If a feature does not help demonstrate workflow orchestration, validation, human review, multi-customer config, integration boundaries, or traceability, do not build it in v1.

Ship visible progress every day.
