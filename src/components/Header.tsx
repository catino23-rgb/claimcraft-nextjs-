'use client';

import { Shield } from 'lucide-react';
import type { Screen } from '../types';
import { signOut } from '../app/auth/actions';

interface HeaderProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  userEmail?: string | null;
  fullName?: string | null;
  organizationName?: string | null;
}

function initialsFor(fullName: string | null | undefined, email: string | null | undefined): string {
  const source = (fullName?.trim() || email?.split('@')[0] || '').trim();
  if (!source) return '';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function Header({
  screen,
  setScreen,
  userEmail = null,
  fullName = null,
  organizationName = null,
}: HeaderProps) {
  const signedIn = Boolean(userEmail);
  const displayName = fullName?.trim() || userEmail || '';
  const orgDisplay = organizationName?.trim() || 'ClaimCraft';
  const avatarInitials = initialsFor(fullName, userEmail) || 'CC';

  return (
    <header className="bg-slate-900 text-stone-100 border-b-2 border-amber-500">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => setScreen('dashboard')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-amber-500 flex items-center justify-center">
            <Shield size={20} className="text-slate-900" />
          </div>
          <div>
            <div className="text-xl tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>ClaimCraft<span className="text-amber-500">.</span></div>
            <div className="text-[10px] tracking-widest text-stone-400 uppercase">Policyholder Advocacy Toolkit</div>
          </div>
        </button>
        <div className="flex items-center gap-4">
          {signedIn ? (
            <>
              <div className="text-xs text-stone-400 hidden sm:block text-right">
                <div className="tracking-widest uppercase">{orgDisplay}</div>
                <div className="text-stone-500">{displayName}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-700 flex items-center justify-center text-sm font-semibold">{avatarInitials}</div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[10px] tracking-widest uppercase text-stone-400 hover:text-amber-400 border-b border-transparent hover:border-amber-500"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <div className="text-xs text-stone-400 hidden sm:block text-right">
              <div className="tracking-widest uppercase">{orgDisplay}</div>
              <div className="text-stone-500">Local mode</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
