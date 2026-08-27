"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AdjustmentTarget, WorkflowState } from "@/types/work/domain";
import {
  addComment,
  addVersion,
  advanceRequest,
  createRequest,
  decideApproval,
  registerAdjustment,
  setRequestState,
  type NewRequestInput,
} from "@/lib/work/mock/store";

function revalidateRequest(id: string) {
  revalidatePath(`/work/requests/${id}`);
  revalidatePath("/work/requests");
  revalidatePath("/work/workflow");
  revalidatePath("/work/home");
  revalidatePath("/work/approvals");
}

export async function advanceRequestAction(id: string) {
  await advanceRequest(id);
  revalidateRequest(id);
}

export async function setRequestStateAction(id: string, state: WorkflowState) {
  await setRequestState(id, state);
  revalidateRequest(id);
}

export async function decideApprovalAction(
  id: string,
  decision: "approved" | "changes_requested",
  note: string,
) {
  await decideApproval(id, decision, note);
  revalidateRequest(id);
}

export async function addCommentAction(id: string, body: string) {
  await addComment(id, body);
  revalidateRequest(id);
}

export async function addVersionAction(
  id: string,
  fileName: string,
  note: string,
) {
  await addVersion(id, fileName, note);
  revalidateRequest(id);
}

export async function registerAdjustmentAction(
  id: string,
  target: AdjustmentTarget,
  comment: string,
) {
  await registerAdjustment(id, target, comment);
  revalidateRequest(id);
}

export async function createRequestAction(formData: FormData) {
  const input: NewRequestInput = {
    projectId: String(formData.get("projectId") ?? ""),
    campaign: String(formData.get("campaign") ?? ""),
    title: String(formData.get("title") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    mainMessage: String(formData.get("mainMessage") ?? ""),
    cta: String(formData.get("cta") ?? ""),
    deliverables: String(formData.get("deliverables") ?? ""),
    formats: String(formData.get("formats") ?? ""),
    channels: String(formData.get("channels") ?? ""),
    references: String(formData.get("references") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
    priority: (String(formData.get("priority") ?? "medium") as NewRequestInput["priority"]),
    assigneeId: (formData.get("assigneeId") ? String(formData.get("assigneeId")) : null),
    roundsIncluded: Number(formData.get("roundsIncluded") ?? 2),
    observations: String(formData.get("observations") ?? ""),
  };

  if (!input.projectId || !input.title.trim()) {
    redirect("/work/requests/new?error=1");
  }

  const id = await createRequest(input);
  revalidatePath("/work/requests");
  revalidatePath("/work/home");
  revalidatePath("/work/workflow");
  redirect(`/work/requests/${id}`);
}
