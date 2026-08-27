import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Approvals · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Approvals"
      description="Piezas esperando tu revisión: copy, dirección creativa, cuenta y cliente."
      phase="Fase 1"
    />
  );
}
