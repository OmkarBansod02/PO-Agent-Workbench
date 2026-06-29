import { PageHeader } from "../app/PageHeader";
import { RunsTable } from "./RunsTable";

export function RunsPage() {
  return (
    <div>
      <PageHeader
        title="Workflow Runs"
        subtitle="History of all purchase order workflow executions"
      />
      <RunsTable />
    </div>
  );
}
