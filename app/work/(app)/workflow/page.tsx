import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/work/shell/placeholder-page";

export const metadata: Metadata = { title: "Workflow · OR-K WORK" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Workflow"
      description="Vista Kanban del flujo Brief → Copy → Design → Review → Client → Approved."
      phase="Fase 2"
    />
  );
}
