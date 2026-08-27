import type { Metadata } from "next";
import { getCalendar, getClients } from "@/lib/work/mock/store";
import { PageHeader } from "@/components/work/shared/page-header";
import { MonthCalendar } from "@/components/work/calendar/month-calendar";

export const metadata: Metadata = { title: "Calendar · OR-K WORK" };

export default async function CalendarPage() {
  const [events, clients] = await Promise.all([getCalendar(), getClients()]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Calendario"
        description="Deadlines, entregas, publicaciones y reuniones."
      />
      <MonthCalendar events={events} clients={clients} />
    </div>
  );
}
