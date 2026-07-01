import type {
  Blocker,
  Customer,
  ExtractedOrder,
  ReplyDraft,
  RouteDecision,
  TraceEvent,
  ValidationIssue,
  WorkflowAction,
} from "../domain/types";
import { createMockOrderJob } from "../integrations/mockOrderSystem";
import { logMockCrmActivity } from "../integrations/mockCrm";
import { createId } from "../utils/ids";
import { nowIso } from "../utils/dates";
import { addTraceEvent } from "./trace";
import { generateReplyDraft } from "./generateReplyDraft";

export interface ExecuteWorkflowActionsInput {
  runId: string;
  emailId: string;
  decision: RouteDecision;
  extractedOrder: ExtractedOrder;
  customer?: Customer;
  validationIssues: ValidationIssue[];
  blockers: Blocker[];
  traceEvents: TraceEvent[];
}

export interface ExecuteWorkflowActionsResult {
  actions: WorkflowAction[];
  draftReply: ReplyDraft;
}

function createReviewTaskPayload(input: ExecuteWorkflowActionsInput): Record<string, unknown> {
  const blockingIssues = input.blockers.filter(({ blocksProgress }) => blocksProgress);
  return {
    taskId: createId("review_task"),
    workflowRunId: input.runId,
    sourceEmailId: input.emailId,
    customerId: input.extractedOrder.customerId ?? input.customer?.id,
    customerName: input.extractedOrder.customerName ?? input.customer?.name,
    reviewReason:
      input.decision === "blocked"
        ? "Blocked before downstream order actions."
        : "Manual review required before downstream order actions.",
    issueCodes: input.validationIssues.map(({ code }) => code),
    blockingIssueCodes: blockingIssues.map(({ code }) => code),
    draftOnly: true,
    autoSend: false,
  };
}

function createAction(input: Omit<WorkflowAction, "id" | "createdAt">): WorkflowAction {
  return {
    ...input,
    id: createId("action"),
    createdAt: nowIso(),
  };
}

export async function executeWorkflowActions(
  input: ExecuteWorkflowActionsInput,
): Promise<ExecuteWorkflowActionsResult> {
  const actions: WorkflowAction[] = [];

  if (input.decision === "completed") {
    const orderJob = await createMockOrderJob({
      runId: input.runId,
      sourceEmailId: input.emailId,
      order: input.extractedOrder,
      customer: input.customer,
    });
    actions.push(
      createAction({
        type: "order_job",
        status: "prepared",
        title: "Order-system job prepared",
        summary: `Prepared ${orderJob.productName} job ${orderJob.jobId} for ${orderJob.customerName}.`,
        payload: { ...orderJob },
      }),
    );
    addTraceEvent(input.traceEvents, {
      step: "order_job_prepared",
      status: "completed",
      title: "Order-system job prepared",
      message: "A simulated order-management job was prepared after deterministic validation passed.",
      metadata: {
        jobId: orderJob.jobId,
        customerId: orderJob.customerId,
        sourceEmailId: input.emailId,
      },
    });

    const crmActivity = await logMockCrmActivity({
      customerId: orderJob.customerId,
      workflowRunId: input.runId,
      emailId: input.emailId,
      type: "order_workflow_prepared",
      summary: `Prepared order-system job ${orderJob.jobId} for ${orderJob.productName}.`,
      outcome: "completed",
    });
    actions.push(
      createAction({
        type: "crm_activity",
        status: "prepared",
        title: "CRM activity prepared",
        summary: `Prepared CRM activity ${crmActivity.activityId} linked to this workflow run.`,
        payload: { ...crmActivity },
      }),
    );
    addTraceEvent(input.traceEvents, {
      step: "crm_activity_prepared",
      status: "completed",
      title: "CRM activity prepared",
      message: "A simulated CRM activity was prepared for the completed workflow.",
      metadata: {
        activityId: crmActivity.activityId,
        customerId: crmActivity.customerId,
        linkedWorkflowRunId: input.runId,
      },
    });
  }

  if (input.decision === "needs_review" || input.decision === "blocked") {
    if (input.decision === "blocked") {
      addTraceEvent(input.traceEvents, {
        step: "workflow_blocked_before_actions",
        status: "blocked",
        title: "Workflow blocked before downstream actions",
        message:
          "Order-system and CRM completion actions were withheld because blocking issues remain.",
        metadata: {
          blockingIssueCodes: input.blockers
            .filter(({ blocksProgress }) => blocksProgress)
            .map(({ code }) => code),
        },
      });
    }

    const reviewTask = createReviewTaskPayload(input);
    actions.push(
      createAction({
        type: "review_task",
        status: input.decision === "blocked" ? "blocked" : "prepared",
        title:
          input.decision === "blocked"
            ? "Blocked review task created"
            : "Review task created",
        summary:
          input.decision === "blocked"
            ? "Created a blocked review task and withheld downstream order actions."
            : "Created a manual review task before downstream order actions.",
        payload: reviewTask,
      }),
    );
    addTraceEvent(input.traceEvents, {
      step: "review_task_created",
      status: input.decision,
      title:
        input.decision === "blocked"
          ? "Blocked review task created"
          : "Review task created",
      message:
        input.decision === "blocked"
          ? "A blocked review task was prepared for human follow-up."
          : "A human review task was prepared before any order-system job is created.",
      metadata: reviewTask,
    });
  }

  const draftReply = await generateReplyDraft({
    decision: input.decision,
    extractedOrder: input.extractedOrder,
    validationIssues: input.validationIssues,
    blockers: input.blockers,
  });
  actions.push(
    createAction({
      type: "reply_draft",
      status: "prepared",
      title: "Customer reply draft generated",
      summary: `${draftReply.draftType} reply draft generated with ${draftReply.method} method; draft only, not sent.`,
      payload: {
        ...draftReply,
        draftOnly: true,
        autoSend: false,
      },
    }),
  );
  addTraceEvent(input.traceEvents, {
    step: "reply_draft_generated",
    status: input.decision,
    title: "Customer reply draft generated",
    message: "A customer reply draft was generated and held as draft-only.",
    metadata: {
      draftType: draftReply.draftType,
      method: draftReply.method,
      draftOnly: true,
      autoSend: false,
    },
  });

  return { actions, draftReply };
}
