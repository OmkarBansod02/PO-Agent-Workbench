interface MetricCardProps {
  label: string;
  value: number;
  color?: "default" | "accent" | "success" | "warning" | "danger";
}

const colorMap = {
  default: "text-foreground",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function MetricCard({ label, value, color = "default" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface px-4 py-3 shadow-sm">
      <div className={`text-2xl font-semibold ${colorMap[color]}`}>{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}
