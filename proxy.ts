import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/work/supabase/middleware";

/**
 * Root proxy (Next.js 16 successor to `middleware.ts`). The matcher below
 * restricts it to the OR-K WORK module only (`/work/:path*`). The public
 * marketing site (`/` and everything else) never hits this proxy.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/work/:path*"],
};
