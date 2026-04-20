import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Magic-link callback.
 *
 * Flow:
 *   1. Read ?code from the query string.
 *   2. Exchange it for a session (writes auth cookies).
 *   3. If this is the user's first sign-in, bootstrap:
 *        - Find or create the single-tenant "ClaimCraft" organization.
 *        - Insert a profiles row for this user.
 *      Both writes use the service-role admin client because the user
 *      has no profiles row yet and cannot satisfy their own RLS policy
 *      until it is created.
 *   4. Redirect to /. On any failure, redirect to /login?error=...
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Supabase is not configured")}`,
    );
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Missing auth code")}`,
    );
  }

  const supabase = await createClient();

  const { data: sessionData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !sessionData?.user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        exchangeError?.message ?? "Could not complete sign-in",
      )}`,
    );
  }

  const user = sessionData.user;

  // Is there already a profile for this auth user? Use the RLS-scoped
  // client for the read — once a profile exists the user can read their
  // own row via the profiles_select_own policy.
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    try {
      const admin = createAdminClient();

      // Find or create the single-tenant ClaimCraft organization.
      const { data: existingOrg, error: orgSelectError } = await admin
        .from("organizations")
        .select("id")
        .eq("name", "ClaimCraft")
        .maybeSingle();

      if (orgSelectError) throw orgSelectError;

      let organizationId = existingOrg?.id as string | undefined;

      if (!organizationId) {
        const { data: newOrg, error: orgInsertError } = await admin
          .from("organizations")
          .insert({ name: "ClaimCraft", plan: "solo" })
          .select("id")
          .single();
        if (orgInsertError) throw orgInsertError;
        organizationId = newOrg.id;
      }

      const email = user.email ?? "";
      const fullName = email.includes("@") ? email.split("@")[0] : email;

      const { error: profileInsertError } = await admin
        .from("profiles")
        .insert({
          id: user.id,
          email,
          full_name: fullName,
          organization_id: organizationId,
          license_number: null,
          license_state: null,
        });
      if (profileInsertError) throw profileInsertError;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bootstrap failed";
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(message)}`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
