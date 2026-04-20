"use server";

import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Server Action: sign out the current user and return to /login.
 *
 * Imported by the Header's sign-out form. When Supabase isn't configured
 * (localStorage-only mode) this is still safe to call — it simply
 * redirects without touching auth.
 */
export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
