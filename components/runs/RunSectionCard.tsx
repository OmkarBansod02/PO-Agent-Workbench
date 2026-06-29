interface RunSectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function RunSectionCard({ title, children }: RunSectionCardProps) {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-background">
        <h3 className="text-xs font-medium text-muted uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-4 py-4 text-sm">{children}</div>
    </div>
  );
}
