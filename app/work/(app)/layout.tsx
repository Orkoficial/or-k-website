import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/work/auth/session";
import { supabaseConfigured } from "@/lib/work/supabase/env";
import { WorkShell } from "@/components/work/shell/work-shell";
import { Toaster } from "@/components/work/ui/sonner";

export default async function WorkAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Once Supabase is connected, an unauthenticated visitor is bounced to login
  // (the middleware also enforces this). In preview mode we let the shell render.
  if (supabaseConfigured && !user) {
    redirect("/work/login");
  }

  return (
    <>
      <WorkShell user={user}>{children}</WorkShell>
      <Toaster position="bottom-right" />
    </>
  );
}
