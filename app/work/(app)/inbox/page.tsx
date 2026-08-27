import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Inbox · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Inbox"
      description="Asignaciones, menciones y solicitudes de aprobación en un solo lugar."
      phase="Fase 2"
    />
  );
}
