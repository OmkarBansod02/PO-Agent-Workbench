import { PageHeader } from "../app/PageHeader";
import { RunsTable } from "./RunsTable";

export function RunsPage() {
  return (
    <div>
      <PageHeader
        title="Workflow Runs"
        subtitle="All purchase order workflow executions and their current state"
      />
      <RunsTable />
    </div>
  );
}
