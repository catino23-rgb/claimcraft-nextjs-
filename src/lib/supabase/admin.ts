import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client that uses the service-role key and therefore
 * bypasses Row Level Security. Use ONLY from trusted server code (Route
 * Handlers, Server Actions). Never expose this to the browser.
 *
 * Current use: first-login bootstrap in /auth/callback, where the newly
 * authenticated user does not yet have a profiles row and cannot satisfy
 * their own RLS policy until it is created. Once the profile exists, all
 * subsequent reads/writes should go through the cookie-based server client
 * in `./server.ts` so they run as the logged-in user.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
