export function Topbar() {
  return (
    <header className="h-11 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">PO Agent Workbench</span>
        <span className="text-xs text-muted">Purchase Order Intake</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted">
          Environment: <span className="text-foreground font-medium">Demo</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          System: Ready
        </span>
      </div>
    </header>
  );
}
