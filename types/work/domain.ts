/* OR-K WORK — domain model.
   These shapes mirror what the Supabase queries will return, so pages can be
   wired now and the data source swapped later without touching the UI. */

export type RoleSlug =
  | "super_admin"
  | "agency_director"
  | "creative_director"
  | "account_manager"
  | "copywriter"
  | "designer"
  | "motion_designer"
  | "developer"
  | "community_manager"
  | "client";

export type WorkflowState =
  | "request"
  | "briefing"
  | "copy"
  | "design"
  | "copy_review"
  | "creative_review"
  | "account_review"
  | "client_review"
  | "adjustments"
  | "approved"
  | "scheduled"
  | "published"
  | "completed"
  | "archived";

export type Priority = "low" | "medium" | "high" | "urgent";

export type AdjustmentTarget =
  | "copy"
  | "design"
  | "copy_design"
  | "information"
  | "product"
  | "format"
  | "other";

export interface WorkUserRecord {
  id: string;
  name: string;
  email: string;
  role: RoleSlug;
  title: string;
  initials: string;
  color: string;
  active: boolean;
}

export interface ClientContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface AssetItem {
  id: string;
  category:
    | "logos"
    | "brandbook"
    | "typography"
    | "colors"
    | "photography"
    | "product"
    | "templates"
    | "references"
    | "documents";
  name: string;
  kind: "image" | "pdf" | "font" | "video" | "zip" | "doc" | "link";
  addedAt: string;
  addedBy: string;
}

export interface Client {
  id: string;
  name: string;
  logoText: string;
  accentColor: string;
  industry: string;
  contact: ClientContact;
  accountManagerId: string;
  teamIds: string[];
  since: string;
  assets: AssetItem[];
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  brief: string;
  status: "active" | "on_hold" | "closed";
  startDate: string;
  targetDate: string;
  leadId: string;
  teamIds: string[];
}

export interface FileVersion {
  id: string;
  label: string; // V1, V2…
  fileName: string;
  kind: AssetItem["kind"];
  uploadedById: string;
  uploadedAt: string;
  note: string;
  state: WorkflowState;
}

export interface DesignMarker {
  id: string;
  index: number;
  x: number; // 0–1 relative to the piece
  y: number;
  body: string;
  authorId: string;
  createdAt: string;
  resolved: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  state: WorkflowState;
  versionLabel?: string;
  mentionIds: string[];
  parentId?: string;
  internal: boolean;
}

export interface ApprovalRecord {
  id: string;
  stage: Extract<
    WorkflowState,
    "copy_review" | "creative_review" | "account_review" | "client_review"
  >;
  decision: "approved" | "changes_requested";
  byId: string;
  at: string;
  note: string;
}

export interface AdjustmentRequest {
  id: string;
  round: number;
  target: AdjustmentTarget;
  comment: string;
  byId: string;
  at: string;
  billable: boolean;
}

export interface ActivityEntry {
  id: string;
  at: string;
  actorId: string;
  verb: string;
  detail: string;
}

export interface CopyDraft {
  concept: string;
  headline: string;
  subheadline: string;
  caption: string;
  cta: string;
  visualIdeas: string;
  notes: string;
  drafts: { label: string; savedAt: string; savedById: string }[];
}

export interface Request {
  id: string; // ORK-2026-0001
  clientId: string;
  projectId: string;
  campaign: string;
  title: string;
  description: string;
  objective: string;
  audience: string;
  mainMessage: string;
  cta: string;
  deliverables: string[];
  formats: string[];
  channels: string[];
  references: string;
  deadline: string;
  priority: Priority;
  state: WorkflowState;
  assigneeId: string | null;
  createdById: string;
  createdAt: string;
  roundsIncluded: number;
  roundsUsed: number;
  observations: string;
  copy: CopyDraft;
  versions: FileVersion[];
  markers: DesignMarker[];
  comments: Comment[];
  approvals: ApprovalRecord[];
  adjustments: AdjustmentRequest[];
  activity: ActivityEntry[];
}

export interface CalendarEvent {
  id: string;
  date: string;
  kind: "deadline" | "delivery" | "publish" | "meeting" | "campaign";
  title: string;
  clientId: string;
  requestId?: string;
}

export interface Notification {
  id: string;
  at: string;
  kind: "assignment" | "mention" | "approval" | "adjustment" | "deadline" | "status";
  body: string;
  href: string;
  read: boolean;
  forUserId: string;
}
