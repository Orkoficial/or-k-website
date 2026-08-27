import { cn } from "@/lib/work/utils";
import { WORKFLOW } from "@/lib/work/workflow";
import { PRIORITY_META, daysUntil } from "@/lib/work/format";
import type { Priority, WorkflowState } from "@/types/work/domain";

const TONE: Record<string, string> = {
  neutral: "border-border text-muted-foreground",
  info: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  progress: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  warn: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  positive: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  muted: "border-border/60 text-muted-foreground/70",
};

export function StatusBadge({
  state,
  className,
}: {
  state: WorkflowState;
  className?: string;
}) {
  const meta = WORKFLOW[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        TONE[meta.tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const meta = PRIORITY_META[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function DeadlinePill({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const d = daysUntil(iso);
  const label =
    d < 0
      ? `Vencido ${Math.abs(d)}d`
      : d === 0
        ? "Hoy"
        : d === 1
          ? "Mañana"
          : `${d} días`;
  const tone =
    d < 0
      ? "border-destructive/30 bg-destructive/10 text-destructive-foreground"
      : d <= 2
        ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
        : "border-border text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
