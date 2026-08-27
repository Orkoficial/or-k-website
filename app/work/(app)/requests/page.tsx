import type { Metadata } from "next";
import Link from "next/link";
import { LayoutList, Plus } from "lucide-react";
import {
  getClients,
  getRequests,
  getSessionUser,
  getUsers,
} from "@/lib/work/mock/store";
import { WORKFLOW, WORKFLOW_ORDER } from "@/lib/work/workflow";
import { cn } from "@/lib/work/utils";
import { PageHeader } from "@/components/work/shared/page-header";
import { EmptyState } from "@/components/work/shared/empty-state";
import { RequestList } from "@/components/work/requests/request-list";
import { Button } from "@/components/work/ui/button";

export const metadata: Metadata = { title: "Requests · OR-K WORK" };

type SP = { state?: string; client?: string; scope?: string };

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const [requests, clients, users, me] = await Promise.all([
    getRequests(),
    getClients(),
    getUsers(),
    getSessionUser(),
  ]);

  let list = [...requests].sort(
    (a, b) => +new Date(a.deadline) - +new Date(b.deadline),
  );
  if (sp.scope === "mine") list = list.filter((r) => r.assigneeId === me.id);
  if (sp.scope === "open")
    list = list.filter((r) => !["completed", "archived"].includes(r.state));
  if (sp.state) list = list.filter((r) => r.state === sp.state);
  if (sp.client) list = list.filter((r) => r.clientId === sp.client);

  const qs = (patch: Partial<SP>) => {
    const next = { ...sp, ...patch };
    const entries = Object.entries(next).filter(([, v]) => v);
    return entries.length ? "?" + new URLSearchParams(entries as [string, string][]) : "";
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-2.5 py-1 text-xs transition-colors",
      active
        ? "border-primary/40 bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Solicitudes"
        description="Todo el trabajo entrando a la agencia."
        actions={
          <Button size="sm" asChild>
            <Link href="/work/requests/new">
              <Plus className="size-4" /> Nueva solicitud
            </Link>
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <Link href={`/work/requests${qs({ scope: undefined })}`} className={chip(!sp.scope)}>
            Todas
          </Link>
          <Link href={`/work/requests${qs({ scope: "open" })}`} className={chip(sp.scope === "open")}>
            Abiertas
          </Link>
          <Link href={`/work/requests${qs({ scope: "mine" })}`} className={chip(sp.scope === "mine")}>
            Mías
          </Link>
          <span className="mx-1 h-4 w-px bg-border" />
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/work/requests${qs({ client: sp.client === c.id ? undefined : c.id })}`}
              className={chip(sp.client === c.id)}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {WORKFLOW_ORDER.filter((s) => s !== "archived").map((s) => (
            <Link
              key={s}
              href={`/work/requests${qs({ state: sp.state === s ? undefined : s })}`}
              className={chip(sp.state === s)}
            >
              {WORKFLOW[s].label}
            </Link>
          ))}
        </div>
      </PageHeader>

      {list.length ? (
        <>
          <p className="mb-2 text-xs text-muted-foreground">
            {list.length} solicitud{list.length === 1 ? "" : "es"}
          </p>
          <RequestList requests={list} clients={clients} users={users} />
        </>
      ) : (
        <EmptyState
          icon={LayoutList}
          title="Sin solicitudes con estos filtros"
          description="Ajusta los filtros o crea una nueva solicitud."
        />
      )}
    </div>
  );
}
