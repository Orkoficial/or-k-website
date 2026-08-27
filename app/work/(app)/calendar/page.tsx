import type { Metadata } from "next";
import Link from "next/link";
import { getCalendar, getClients } from "@/lib/work/mock/store";
import { fullDate } from "@/lib/work/format";
import { PageHeader, ClientMark } from "@/components/work/shared/page-header";
import { EmptyState } from "@/components/work/shared/empty-state";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Calendar · OR-K WORK" };

const KIND: Record<string, { label: string; className: string }> = {
  deadline: { label: "Deadline", className: "bg-amber-400/10 text-amber-300 border-amber-400/25" },
  delivery: { label: "Entrega", className: "bg-sky-400/10 text-sky-300 border-sky-400/25" },
  publish: { label: "Publicación", className: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25" },
  meeting: { label: "Reunión", className: "bg-violet-400/10 text-violet-300 border-violet-400/25" },
  campaign: { label: "Campaña", className: "bg-primary/10 text-primary border-primary/25" },
};

export default async function CalendarPage() {
  const [events, clients] = await Promise.all([getCalendar(), getClients()]);
  const clientById = (id: string) => clients.find((c) => c.id === id);

  const upcoming = events.filter(
    (e) => new Date(e.date).getTime() > Date.now() - 3 * 86_400_000,
  );

  const byDay = new Map<string, typeof events>();
  for (const e of upcoming) {
    const key = new Date(e.date).toDateString();
    byDay.set(key, [...(byDay.get(key) ?? []), e]);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Calendario"
        description="Deadlines, entregas, publicaciones y reuniones."
      />

      {byDay.size === 0 ? (
        <EmptyState icon={CalendarDays} title="Sin eventos próximos" />
      ) : (
        <div className="flex flex-col gap-5">
          {[...byDay.entries()].map(([day, list]) => (
            <div key={day}>
              <p className="mb-2 text-sm font-medium">
                {fullDate(list[0].date)}
              </p>
              <ul className="flex flex-col gap-1.5">
                {list.map((e) => {
                  const client = clientById(e.clientId);
                  const meta = KIND[e.kind];
                  const body = (
                    <div className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2">
                      {client ? (
                        <ClientMark
                          name={client.name}
                          logoText={client.logoText}
                          color={client.accentColor}
                          size={22}
                        />
                      ) : null}
                      <span className="flex-1 text-sm">{e.title}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                  );
                  return (
                    <li key={e.id}>
                      {e.requestId ? (
                        <Link
                          href={`/work/requests/${e.requestId}`}
                          className="block transition-colors hover:opacity-80"
                        >
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
