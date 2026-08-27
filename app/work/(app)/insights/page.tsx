import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Insights · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Insights"
      description="Métricas de operación: rondas, tiempos por etapa y tareas atrasadas."
      phase="Fase 3"
    />
  );
}
