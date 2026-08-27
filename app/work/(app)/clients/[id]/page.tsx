import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import {
  getClient,
  getProjectsByClient,
  getRequestsByClient,
  getUsers,
} from "@/lib/work/mock/store";
import { relativeTime, shortDate } from "@/lib/work/format";
import { PageHeader, ClientMark } from "@/components/work/shared/page-header";
import { PersonInline } from "@/components/work/shared/people";
import { RequestList } from "@/components/work/requests/request-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/work/ui/card";

const ASSET_LABEL: Record<string, string> = {
  logos: "Logos",
  brandbook: "Brandbook",
  typography: "Tipografía",
  colors: "Color",
  photography: "Fotografía",
  product: "Producto",
  templates: "Plantillas",
  references: "Referencias",
  documents: "Documentos",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getClient(id);
  return { title: `${c?.name ?? "Cliente"} · OR-K WORK` };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  const [projects, requests, users] = await Promise.all([
    getProjectsByClient(id),
    getRequestsByClient(id),
    getUsers(),
  ]);
  const userById = (uid: string) => users.find((u) => u.id === uid);
  const team = client.teamIds.map(userById).filter(Boolean) as typeof users;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/work/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Clientes
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <ClientMark
              name={client.name}
              logoText={client.logoText}
              color={client.accentColor}
              size={32}
            />
            {client.name}
          </span>
        }
        description={`${client.industry} · cliente desde ${shortDate(client.since)}`}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-4">
          <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-sm">Proyectos · {projects.length}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ul className="flex flex-col">
                {projects.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/work/projects/${p.id}`}
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/40"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        meta {shortDate(p.targetDate)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-sm">
                Solicitudes · {requests.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RequestList
                requests={requests.sort(
                  (a, b) => +new Date(a.deadline) - +new Date(b.deadline),
                )}
                clients={[client]}
                users={users}
                showClient={false}
              />
            </CardContent>
          </Card>

          <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-sm">
                Assets · {client.assets.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {client.assets.length ? (
                <ul className="flex flex-col gap-1.5">
                  {client.assets.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {ASSET_LABEL[a.category]}
                      </span>
                      <span className="truncate">{a.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {relativeTime(a.addedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin assets cargados.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="gap-2 p-4 text-sm">
            <p className="font-medium">{client.contact.name}</p>
            <p className="text-muted-foreground">{client.contact.role}</p>
            <a
              href={`mailto:${client.contact.email}`}
              className="mt-1 flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-3.5" /> {client.contact.email}
            </a>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="size-3.5" /> {client.contact.phone}
            </span>
          </Card>

          <Card className="gap-3 p-4 text-sm">
            <p className="text-muted-foreground">Ejecutiva</p>
            {userById(client.accountManagerId) ? (
              <PersonInline
                person={userById(client.accountManagerId)!}
                size="xs"
              />
            ) : null}
            <p className="mt-2 text-muted-foreground">Equipo asignado</p>
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
