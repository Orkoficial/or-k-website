import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getClient,
  getProject,
  getRequestsByProject,
  getUsers,
} from "@/lib/work/mock/store";
import { fullDate, relativeTime } from "@/lib/work/format";
import { PageHeader, ClientMark } from "@/components/work/shared/page-header";
import { PersonInline } from "@/components/work/shared/people";
import { RequestList } from "@/components/work/requests/request-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/work/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getProject(id);
  return { title: `${p?.name ?? "Proyecto"} · OR-K WORK` };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const [client, requests, users] = await Promise.all([
    getClient(project.clientId),
    getRequestsByProject(id),
    getUsers(),
  ]);
  const userById = (uid: string) => users.find((u) => u.id === uid);
  const team = project.teamIds.map(userById).filter(Boolean) as typeof users;
  const clients = client ? [client] : [];

  const activity = requests
    .flatMap((r) =>
      r.activity.map((a) => ({ ...a, requestId: r.id, requestTitle: r.title })),
    )
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/work/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Proyectos
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            {client ? (
              <ClientMark
                name={client.name}
                logoText={client.logoText}
                color={client.accentColor}
                size={26}
              />
            ) : null}
            {project.name}
          </span>
        }
        description={`${client?.name} · meta ${fullDate(project.targetDate)}`}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-4">
          <Card className="p-4 text-sm">
            <p className="text-muted-foreground">{project.brief}</p>
          </Card>

          <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-sm">
                Solicitudes · {requests.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {requests.length ? (
                <RequestList
                  requests={requests}
                  clients={clients}
                  users={users}
                  showClient={false}
                />
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  Sin solicitudes.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-sm">Actividad</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ol className="flex flex-col gap-2 text-sm">
                {activity.map((a) => (
                  <li key={a.id} className="text-muted-foreground">
                    <Link
                      href={`/work/requests/${a.requestId}`}
                      className="text-foreground hover:underline"
                    >
                      {userById(a.actorId)?.name.split(" ")[0]}
                    </Link>{" "}
                    {a.verb} {a.detail} · {relativeTime(a.at)}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="gap-3 p-4 text-sm">
            <p className="text-muted-foreground">Lead</p>
            {userById(project.leadId) ? (
              <PersonInline person={userById(project.leadId)!} size="xs" />
            ) : null}
            <p className="mt-2 text-muted-foreground">Equipo</p>
            <div className="flex flex-col gap-2">
              {team.map((u) => (
                <PersonInline key={u.id} person={u} size="xs" muted />
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
