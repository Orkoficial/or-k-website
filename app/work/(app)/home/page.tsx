import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Home · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Home"
      description="Tu resumen del día: tareas, aprobaciones pendientes y deadlines."
      phase="Fase 1"
    />
  );
}
