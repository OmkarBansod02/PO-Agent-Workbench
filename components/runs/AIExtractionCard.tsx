import { RunSectionCard } from "./RunSectionCard";

interface AIExtractionCardProps {
  method: "ai" | "fallback";
  model?: string;
  confidence: number;
  uncertainFields: string[];
  extractionSummary?: string;
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-success";
  if (confidence >= 0.6) return "text-warning";
  return "text-danger";
}

function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function AIExtractionCard({
  method,
  model,
  confidence,
  uncertainFields,
  extractionSummary,
}: AIExtractionCardProps) {
  return (
    <RunSectionCard title="Extraction">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-muted text-xs">Method</span>
            <p className="font-medium text-foreground">
              {method === "ai" ? "AI extraction" : "Fallback extraction"}
            </p>
          </div>
          <div>
            <span className="text-muted text-xs">Model</span>
            <p className="font-medium text-foreground">
              {model ?? "—"}
            </p>
          </div>
          <div>
            <span className="text-muted text-xs">Confidence</span>
            <p className={`font-semibold tabular-nums ${confidenceColor(confidence)}`}>
              {Math.round(confidence * 100)}%
            </p>
          </div>
          <div>
            <span className="text-muted text-xs">Uncertain fields</span>
            {uncertainFields.length === 0 ? (
              <p className="text-foreground/60 text-sm">None</p>
            ) : (
              <div className="flex flex-wrap gap-1 mt-0.5">
                {uncertainFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center px-1.5 py-0.5 rounded bg-warning/10 text-warning text-xs"
                  >
                    {formatFieldName(field)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {extractionSummary && (
          <div className="border-t border-border pt-3">
            <span className="text-muted text-xs">Summary</span>
            <p className="text-sm text-foreground/80 mt-0.5">
              {extractionSummary}
            </p>
          </div>
        )}
      </div>
    </RunSectionCard>
  );
}
