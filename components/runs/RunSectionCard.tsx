interface RunSectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function RunSectionCard({ title, children }: RunSectionCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 border-b border-border/40 bg-background/40">
        <h3 className="text-xs font-medium text-muted uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-4 py-4 text-sm">{children}</div>
    </div>
  );
}
