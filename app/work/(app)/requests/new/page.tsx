import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClients, getProjects, getUsers } from "@/lib/work/mock/store";
import { createRequestAction } from "@/lib/work/actions";
import { PageHeader } from "@/components/work/shared/page-header";
import { Card, CardContent } from "@/components/work/ui/card";
import { Button } from "@/components/work/ui/button";
import { Input } from "@/components/work/ui/input";
import { Label } from "@/components/work/ui/label";
import { Textarea } from "@/components/work/ui/textarea";

export const metadata: Metadata = { title: "Nueva solicitud · OR-K WORK" };

export default async function NewRequestPage() {
  const [clients, projects, users] = await Promise.all([
    getClients(),
    getProjects(),
    getUsers(),
  ]);
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/work/requests"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Solicitudes
      </Link>
      <PageHeader
        title="Nueva solicitud"
        description="Se genera un ID automático (ORK-AAAA-0000) y entra al flujo en estado Solicitud."
      />

      <Card>
        <CardContent className="p-5">
          <form action={createRequestAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="projectId">Proyecto</Label>
              <select
                id="projectId"
                name="projectId"
                required
                defaultValue=""
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  Selecciona un proyecto
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {clientName(p.clientId)} · {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Field name="title" label="Título" required />
              <Field name="campaign" label="Campaña" />
            </div>

            <TextField name="objective" label="Objetivo" required />
            <TextField name="audience" label="Público objetivo" />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="mainMessage" label="Mensaje principal" />
              <Field name="cta" label="CTA" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <TextField name="deliverables" label="Entregables" hint="uno por línea o separados por coma" />
              <TextField name="formats" label="Formatos" hint="ej. 1080×1080" />
              <TextField name="channels" label="Canales" hint="ej. Instagram" />
            </div>

            <TextField name="references" label="Referencias" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="deadline">Fecha límite</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue="medium"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roundsIncluded">Rondas incluidas</Label>
                <Input
                  id="roundsIncluded"
                  name="roundsIncluded"
                  type="number"
                  min={0}
                  max={5}
                  defaultValue={2}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assigneeId">Responsable</Label>
              <select
                id="assigneeId"
                name="assigneeId"
                defaultValue=""
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Sin asignar</option>
                {users
                  .filter((u) => u.role !== "client")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.title}
                    </option>
                  ))}
              </select>
            </div>

            <TextField name="observations" label="Observaciones" />

            <div className="mt-1 flex justify-end gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/work/requests">Cancelar</Link>
              </Button>
              <Button type="submit" size="sm">
                Crear solicitud
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required={required} />
    </div>
  );
}

function TextField({
  name,
  label,
  hint,
  required,
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>
        {label}
        {hint ? (
          <span className="ml-1 font-normal text-muted-foreground">· {hint}</span>
        ) : null}
      </Label>
      <Textarea id={name} name={name} required={required} className="min-h-16" />
    </div>
  );
}
