import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Assets · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Assets"
      description="Biblioteca por cliente: logos, tipografías, fotografía, plantillas."
      phase="Fase 2"
    />
  );
}
