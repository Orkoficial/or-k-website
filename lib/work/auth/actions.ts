"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/work/supabase/server";
import { supabaseConfigured } from "@/lib/work/supabase/env";

export type AuthState = { error: string | null };

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!supabaseConfigured) {
    return {
      error:
        "Supabase aún no está configurado. Añade las claves del proyecto en .env.local.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/work");

  if (!email || !password) {
    return { error: "Introduce tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciales incorrectas o cuenta sin acceso." };
  }

  redirect(redirectTo.startsWith("/work") ? redirectTo : "/work");
}

export async function signOut() {
  if (supabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/work/login");
}
