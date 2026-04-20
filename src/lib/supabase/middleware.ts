import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every matched request.
 *
 * Called from the root `middleware.ts`. The `getAll` / `setAll` cookie
 * interface is the current (non-deprecated) @supabase/ssr API: the library
 * hands us back any cookies that changed during token refresh, and we
 * forward them onto both the incoming request and the outgoing response so
 * downstream handlers and the browser stay in sync.
 *
 * If the Supabase env vars are missing we do nothing — this lets the app
 * continue running on the localStorage fallback until credentials are
 * configured.
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // Auth-cookie responses must bypass CDN caches; forward the
        // Cache-Control / Expires / Pragma headers the library hands us.
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // IMPORTANT: Do not run other logic between createServerClient and
  // getClaims — it's what triggers the token refresh that makes the
  // setAll callback fire.
  await supabase.auth.getClaims();

  return response;
}
