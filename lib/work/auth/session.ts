import { createClient } from "@/lib/work/supabase/server";
import { supabaseConfigured } from "@/lib/work/supabase/env";

export type WorkUser = {
  id: string;
  email: string;
  name: string;
  /** RBAC role slug. Properly typed and enforced in the RBAC slice. */
  role: string;
};

/**
 * Returns the authenticated OR-K WORK user, or `null`.
 * Returns `null` in preview mode (Supabase not yet provisioned).
 */
export async function getCurrentUser(): Promise<WorkUser | null> {
  if (!supabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "",
    name: (meta.name as string) || (meta.full_name as string) || user.email || "Usuario",
    role: (meta.role as string) || "member",
  };
}
