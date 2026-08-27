import type { Metadata } from "next";
import { getRequests } from "@/lib/work/mock/store";
import { HAPPY_PATH, WORKFLOW } from "@/lib/work/workflow";
import { PageHeader } from "@/components/work/shared/page-header";
import { MetricCard } from "@/components/work/shared/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/work/ui/card";
import { Progress } from "@/components/work/ui/progress";

export const metadata: Metadata = { title: "Insights · OR-K WORK" };

// Mock stage-timing averages (days) — replaced by real analytics later.
const STAGE_DAYS: Partial<Record<string, number>> = {
  briefing: 1.2,
  copy: 2.4,
  design: 3.1,
  copy_review: 0.8,
  creative_review: 1.1,
  account_review: 0.6,
  client_review: 2.0,
};

export default async function InsightsPage() {
  const requests = await getRequests();
  const active = requests.filter(
    (r) => !["completed", "archived"].includes(r.state),
  );
  const withRounds = requests.filter((r) => r.roundsUsed > 0);
  const avgRounds =
    withRounds.reduce((a, r) => a + r.roundsUsed, 0) /
    Math.max(1, withRounds.length);
  const overRounds = requests.filter(
    (r) => r.roundsUsed > r.roundsIncluded,
  ).length;
  const overdue = active.filter(
    (r) => new Date(r.deadline).getTime() < Date.now(),
  ).length;
  const completed = requests.filter((r) =>
    ["completed", "published"].includes(r.state),
  ).length;

  const byStage = HAPPY_PATH.map((s) => ({
    state: s,
    label: WORKFLOW[s].label,
    count: requests.filter((r) => r.state === s).length,
  }));
  const maxStage = Math.max(1, ...byStage.map((b) => b.count));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Insights"
        description="Métricas de operación. Datos de demostración."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Solicitudes activas" value={active.length} />
        <MetricCard label="Completadas" value={completed} tone="positive" />
        <MetricCard
          label="Promedio de rondas"
          value={avgRounds.toFixed(1)}
          tone={avgRounds > 1.5 ? "warn" : "default"}
        />
        <MetricCard
          label="Atrasadas"
          value={overdue}
          tone={overdue ? "warn" : "positive"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-border py-3">
            <CardTitle className="text-sm">Distribución por etapa</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-4">
            {byStage.map((b) => (
              <div key={b.state} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0 text-muted-foreground">
                  {b.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${(b.count / maxStage) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs tabular-nums">
                  {b.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-border py-3">
            <CardTitle className="text-sm">
              Tiempo promedio por etapa (días)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-4">
            {Object.entries(STAGE_DAYS).map(([state, days]) => (
              <div key={state} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0 text-muted-foreground">
                  {WORKFLOW[state as keyof typeof WORKFLOW].label}
                </span>
                <Progress value={(days! / 4) * 100} className="flex-1" />
                <span className="w-8 text-right font-mono text-xs tabular-nums">
                  {days}
                </span>
              </div>
            ))}
            <p className="mt-1 text-xs text-muted-foreground">
              {overRounds} solicitud(es) superaron sus rondas incluidas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
