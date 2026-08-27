import { createClient } from "@/lib/work/supabase/server";
import { supabaseConfigured } from "@/lib/work/supabase/env";
import { getSessionUser } from "@/lib/work/mock/store";
import type { RoleSlug } from "@/types/work/domain";

export type WorkUser = {
  id: string;
  email: string;
  name: string;
  role: RoleSlug;
  title: string;
  initials: string;
  color: string;
};

/**
 * Returns the current OR-K WORK user.
 * While Supabase is not provisioned this resolves to the mock session user so
 * the whole app behaves "as if" someone is signed in.
 */
export async function getCurrentUser(): Promise<WorkUser | null> {
  if (!supabaseConfigured) {
    const u = await getSessionUser();
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      title: u.title,
      initials: u.initials,
      color: u.color,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const meta = user.user_metadata ?? {};
  const name =
    (meta.name as string) || (meta.full_name as string) || user.email || "Usuario";
  return {
    id: user.id,
    email: user.email ?? "",
    name,
    role: ((meta.role as RoleSlug) ?? "account_manager") as RoleSlug,
    title: (meta.title as string) ?? "",
    initials: name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase(),
    color: (meta.color as string) ?? "#e31572",
  };
}
