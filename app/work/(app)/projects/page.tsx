import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Projects · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Projects"
      description="Proyectos por cliente con tareas, archivos, timeline y equipo."
      phase="Fase 1"
    />
  );
}
