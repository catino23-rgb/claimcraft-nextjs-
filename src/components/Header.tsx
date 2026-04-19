'use client';

import { Shield } from 'lucide-react';

interface HeaderProps {
  screen: string;
  setScreen: (screen: string) => void;
}

export default function Header({ screen, setScreen }: HeaderProps) {
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
          <div className="text-xs text-stone-400 hidden sm:block">
            <div className="tracking-widest uppercase">Acme Public Adjusting</div>
            <div className="text-stone-500">Josh M. · Licensed PA</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-stone-700 flex items-center justify-center text-sm font-semibold">JM</div>
        </div>
      </div>
    </header>
  );
}