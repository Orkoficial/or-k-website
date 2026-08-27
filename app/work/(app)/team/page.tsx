import type { Metadata } from "next";
import { getWorkload } from "@/lib/work/mock/store";
import { PageHeader } from "@/components/work/shared/page-header";
import { PersonAvatar } from "@/components/work/shared/people";
import { Card } from "@/components/work/ui/card";

export const metadata: Metadata = { title: "Team · OR-K WORK" };

const LOAD: Record<string, { label: string; className: string }> = {
  low: { label: "Ligera", className: "bg-emerald-400/10 text-emerald-300" },
  medium: { label: "Media", className: "bg-amber-400/10 text-amber-300" },
  high: { label: "Alta", className: "bg-primary/10 text-primary" },
};

export default async function TeamPage() {
  const workload = await getWorkload();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Equipo"
        description="Integrantes de OR-K y su carga de trabajo actual."
      />
      <Card className="gap-0 py-0">
        <ul className="divide-y divide-border">
          {workload.map(({ user, count, urgent, load }) => (
            <li
              key={user.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <PersonAvatar person={user} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.title}
                </p>
              </div>
              <div className="hidden text-right text-xs text-muted-foreground sm:block">
                {urgent} prioritarias
              </div>
              <span className="font-mono text-sm tabular-nums">
                {count} tareas
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${LOAD[load].className}`}
              >
                {LOAD[load].label}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
