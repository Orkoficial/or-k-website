import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Settings · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Configuración de la cuenta, roles y preferencias del workspace."
      phase="Fase 1"
    />
  );
}
