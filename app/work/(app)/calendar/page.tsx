import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Calendar · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Calendar"
      description="Deadlines, entregas, publicaciones y campañas."
      phase="Fase 2"
    />
  );
}
