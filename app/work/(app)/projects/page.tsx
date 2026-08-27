import type { Metadata } from "next";
import Link from "next/link";
import { getClients, getProjects, getRequests, getUsers } from "@/lib/work/mock/store";
import { HAPPY_PATH } from "@/lib/work/workflow";
import { shortDate } from "@/lib/work/format";
import { PageHeader, ClientMark } from "@/components/work/shared/page-header";
import { PersonStack } from "@/components/work/shared/people";
import { Card } from "@/components/work/ui/card";
import { Progress } from "@/components/work/ui/progress";
import { Badge } from "@/components/work/ui/badge";

export const metadata: Metadata = { title: "Projects · OR-K WORK" };

const STATUS_LABEL = { active: "Activo", on_hold: "En pausa", closed: "Cerrado" } as const;

export default async function ProjectsPage() {
  const [projects, clients, requests, users] = await Promise.all([
    getProjects(),
    getClients(),
    getRequests(),
    getUsers(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Proyectos"
        description="Un proyecto agrupa las solicitudes de una campaña o entregable de cliente."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((p) => {
          const client = clients.find((c) => c.id === p.clientId)!;
          const reqs = requests.filter((r) => r.projectId === p.id);
          const done = reqs.filter((r) =>
            ["approved", "scheduled", "published", "completed"].includes(r.state),
          ).length;
          const progress = reqs.length
            ? Math.round(
                (reqs.reduce(
                  (acc, r) => acc + HAPPY_PATH.indexOf(r.state) / (HAPPY_PATH.length - 1),
                  0,
                ) /
                  reqs.length) *
                  100,
              )
            : 0;
          const team = p.teamIds
            .map((id) => users.find((u) => u.id === id))
            .filter(Boolean) as typeof users;
          return (
            <Link key={p.id} href={`/work/projects/${p.id}`}>
              <Card className="h-full gap-3 p-4 transition-colors hover:border-primary/40">
                <div className="flex items-center gap-2">
                  <ClientMark
                    name={client.name}
                    logoText={client.logoText}
                    color={client.accentColor}
                    size={26}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {client.name}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-auto text-[11px] font-normal"
                  >
                    {STATUS_LABEL[p.status]}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {p.brief}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {done}/{reqs.length} solicitudes listas
                  </span>
                  <span>Meta {shortDate(p.targetDate)}</span>
                </div>
                <Progress value={progress} />
                <PersonStack people={team} />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
