import { cn } from "@/lib/work/utils";
import { Card } from "@/components/work/ui/card";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "warn" | "positive";
}) {
  return (
    <Card className="gap-1 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-mono text-2xl font-semibold tabular-nums",
          tone === "warn" && "text-amber-300",
          tone === "positive" && "text-emerald-300",
        )}
      >
        {value}
      </p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
