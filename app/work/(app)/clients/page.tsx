import type { Metadata } from "next";
import Link from "next/link";
import {
  getClients,
  getProjects,
  getRequests,
  getUsers,
} from "@/lib/work/mock/store";
import { shortDate } from "@/lib/work/format";
import { PageHeader, ClientMark } from "@/components/work/shared/page-header";
import { PersonInline } from "@/components/work/shared/people";
import { Card } from "@/components/work/ui/card";

export const metadata: Metadata = { title: "Clients · OR-K WORK" };

export default async function ClientsPage() {
  const [clients, projects, requests, users] = await Promise.all([
    getClients(),
    getProjects(),
    getRequests(),
    getUsers(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Clientes" description="Cuentas activas de OR-K." />
      <div className="grid gap-3 sm:grid-cols-2">
        {clients.map((c) => {
          const am = users.find((u) => u.id === c.accountManagerId);
          const projCount = projects.filter((p) => p.clientId === c.id).length;
          const openReqs = requests.filter(
            (r) =>
              r.clientId === c.id &&
              !["completed", "archived"].includes(r.state),
          ).length;
          return (
            <Link key={c.id} href={`/work/clients/${c.id}`}>
              <Card className="h-full gap-3 p-4 transition-colors hover:border-primary/40">
                <div className="flex items-center gap-3">
                  <ClientMark
                    name={c.name}
                    logoText={c.logoText}
                    color={c.accentColor}
                    size={36}
                  />
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.industry}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{projCount} proyectos</span>
                  <span>{openReqs} solicitudes abiertas</span>
                  <span>desde {shortDate(c.since)}</span>
                </div>
                {am ? <PersonInline person={am} size="xs" muted /> : null}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
