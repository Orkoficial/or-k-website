import type { Metadata } from "next";
import { getClients, getRequests, getUsers } from "@/lib/work/mock/store";
import { PageHeader } from "@/components/work/shared/page-header";
import { KanbanBoard } from "@/components/work/workflow/kanban-board";

export const metadata: Metadata = { title: "Workflow · OR-K WORK" };

export default async function WorkflowPage() {
  const [requests, clients, users] = await Promise.all([
    getRequests(),
    getClients(),
    getUsers(),
  ]);

  const board = requests.filter((r) => r.state !== "archived");

  return (
    <div>
      <PageHeader
        title="Workflow"
        description="Arrastra una tarjeta a otra columna para cambiar su estado."
      />
      <KanbanBoard requests={board} clients={clients} users={users} />
    </div>
  );
}
