import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "./env";

const LOGIN_PATH = "/work/login";

/** Public /work routes that never require an authenticated session. */
function isPublicWorkPath(pathname: string) {
  return (
    pathname === LOGIN_PATH ||
    pathname.startsWith("/work/auth") ||
    pathname === "/work/forgot-password" ||
    pathname === "/work/reset-password"
  );
}

/**
 * Refreshes the Supabase auth session on every /work request and guards
 * protected routes. Runs only for `/work/:path*` (see middleware matcher),
 * so the public marketing site is completely untouched.
 */
export async function updateSession(request: NextRequest) {
  // Before Supabase is provisioned, let /work render so the UI can be built.
  if (!supabaseConfigured) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = isPublicWorkPath(pathname);

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = "/work";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
