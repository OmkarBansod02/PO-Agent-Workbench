interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
