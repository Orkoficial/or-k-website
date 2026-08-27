import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Team · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Team"
      description="Integrantes de OR-K, roles y carga de trabajo."
      phase="Fase 2"
    />
  );
}
