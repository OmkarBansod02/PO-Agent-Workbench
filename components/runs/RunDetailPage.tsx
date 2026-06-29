import { RunHeader } from "./RunHeader";
import { RunSectionCard } from "./RunSectionCard";

export function RunDetailPage() {
  return (
    <div>
      <RunHeader
        customer="Arbor Lane Co."
        subject="Repeat hoodie order for July event"
        status="completed"
        runId="run-arborlane-001"
        startedAt="2025-06-28 09:14"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RunSectionCard title="Original Email">
          <div className="space-y-2 text-foreground/80">
            <div className="text-xs text-muted">From: orders@arborlane.co</div>
            <div className="text-xs text-muted">Subject: July hoodie reorder — PO-4821</div>
            <p className="mt-2 leading-relaxed">
              Hi team, we&apos;d like to reorder 150 units of the classic pullover hoodie (style H-200) 
              in Navy for our July company event. Same specs as last order. PO number is 4821. 
              Need by July 15. Ship to our main warehouse. Thanks!
            </p>
          </div>
        </RunSectionCard>

        <RunSectionCard title="Extracted Order">
          <div className="space-y-1.5">
            <Row label="PO Number" value="PO-4821" />
            <Row label="Customer" value="Arbor Lane Co." />
            <Row label="Product" value="Classic Pullover Hoodie (H-200)" />
            <Row label="Color" value="Navy" />
            <Row label="Quantity" value="150" />
            <Row label="Due Date" value="July 15, 2025" />
            <Row label="Shipping" value="Main warehouse (on file)" />
            <Row label="Decoration" value="Per previous order" />
          </div>
        </RunSectionCard>

        <RunSectionCard title="Validation & Blockers">
          <div className="space-y-2">
            <ValidationRow label="PO number present" passed />
            <ValidationRow label="Customer recognized" passed />
            <ValidationRow label="Product in catalog" passed />
            <ValidationRow label="Quantity valid" passed />
            <ValidationRow label="Due date feasible" passed />
            <ValidationRow label="Shipping destination on file" passed />
            <ValidationRow label="Artwork reference available" passed />
          </div>
        </RunSectionCard>

        <RunSectionCard title="Actions">
          <div className="space-y-2">
            <ActionRow label="Order job created" detail="JOB-20250628-001" />
            <ActionRow label="CRM activity logged" detail="ACT-20250628-001" />
            <ActionRow label="Customer reply drafted" detail="Confirmation email ready" />
          </div>
        </RunSectionCard>

        <RunSectionCard title="Draft Reply">
          <div className="text-foreground/80 leading-relaxed">
            <p className="text-xs text-muted mb-2">To: orders@arborlane.co</p>
            <p>
              Hi Arbor Lane team, we&apos;ve received your order for 150× Classic Pullover Hoodies 
              (Navy, H-200) under PO-4821. Production is confirmed with a target ship date 
              aligned to your July 15 deadline. We&apos;ll follow up with tracking. Thanks!
            </p>
          </div>
        </RunSectionCard>

        <RunSectionCard title="Audit Trace">
          <div className="space-y-2">
            <TraceRow time="09:14:00" step="Email received" />
            <TraceRow time="09:14:01" step="Intent classified: purchase_order" />
            <TraceRow time="09:14:01" step="Order details extracted" />
            <TraceRow time="09:14:02" step="Customer lookup: matched" />
            <TraceRow time="09:14:02" step="Catalog lookup: H-200 active" />
            <TraceRow time="09:14:03" step="Validation: all rules passed" />
            <TraceRow time="09:14:03" step="Risk score: low (0.12)" />
            <TraceRow time="09:14:03" step="Route decision: auto-process" />
            <TraceRow time="09:14:04" step="Job created: JOB-20250628-001" />
            <TraceRow time="09:14:04" step="CRM logged: ACT-20250628-001" />
            <TraceRow time="09:14:04" step="Draft reply generated" />
          </div>
        </RunSectionCard>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border last:border-0">
      <span className="text-muted text-xs">{label}</span>
      <span className="text-foreground font-medium text-xs">{value}</span>
    </div>
  );
}

function ValidationRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-1.5 h-1.5 rounded-full ${passed ? "bg-success" : "bg-danger"}`} />
      <span className={passed ? "text-foreground/70" : "text-danger"}>{label}</span>
    </div>
  );
}

function ActionRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-foreground/80">{label}</span>
      <span className="text-xs font-mono text-muted">{detail}</span>
    </div>
  );
}

function TraceRow({ time, step }: { time: string; step: string }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <span className="text-[11px] font-mono text-muted shrink-0">{time}</span>
      <span className="text-xs text-foreground/80">{step}</span>
    </div>
  );
}
