import { getDemoInboxEmails } from "../lib/email/demoEmailSource";
import { runPOWorkflow } from "../lib/workflow/runWorkflow";

async function main() {
  for (const email of getDemoInboxEmails()) {
    const run = await runPOWorkflow({
      emailId: email.id,
      rawEmail: email.bodyText,
      source: email.source,
      customerId: email.metadata.customerId,
    });

    console.log(
      JSON.stringify({
        emailId: email.id,
        expected: email.metadata.expectedOutcome,
        status: run.status,
        routeDecision: run.routeDecision,
        validationIssues: run.validationIssues.map((issue) => issue.code),
        blockers: run.blockers.map((blocker) => ({
          code: blocker.code,
          blocksProgress: blocker.blocksProgress,
        })),
      }),
    );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Smoke check failed");
  process.exitCode = 1;
});
