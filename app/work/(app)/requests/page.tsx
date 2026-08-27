import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Requests · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Requests"
      description="Solicitudes de la ejecutiva con brief, entregables y prioridad."
      phase="Fase 1"
    />
  );
}
