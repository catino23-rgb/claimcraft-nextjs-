import { redirect } from 'next/navigation';
import ClaimCraftApp from '../components/ClaimCraftApp';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export default async function Page() {
  // Local-only fallback: if Supabase env vars aren't set, skip the auth
  // gate and render the app in localStorage-only mode.
  if (!isSupabaseConfigured()) {
    return (
      <ClaimCraftApp
        userEmail={null}
        fullName={null}
        organizationName={null}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile + organization name for Header. If the profile read fails
  // (e.g. bootstrap race), fall back to the user's email and "ClaimCraft".
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name, organizations ( name )')
    .eq('id', user.id)
    .maybeSingle();

  const organizations = profile?.organizations as { name: string } | { name: string }[] | null | undefined;
  const orgName = Array.isArray(organizations)
    ? organizations[0]?.name ?? null
    : organizations?.name ?? null;

  return (
    <ClaimCraftApp
      userEmail={profile?.email ?? user.email ?? null}
      fullName={profile?.full_name ?? null}
      organizationName={orgName ?? 'ClaimCraft'}
    />
  );
}
