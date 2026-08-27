import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Clients · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Clients"
      description="Fichas de cliente con contacto, equipo, brandbook y assets."
      phase="Fase 1"
    />
  );
}
