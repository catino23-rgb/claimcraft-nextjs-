'use client';

import { ArrowLeft } from 'lucide-react';
import type { Screen } from '../types';

interface BackButtonProps {
  setScreen: (screen: Screen) => void;
  to?: Screen;
  label?: string;
}

export default function BackButton({ setScreen, to = 'dashboard', label = 'Back to Dashboard' }: BackButtonProps) {
  return (
    <button onClick={() => setScreen(to)} className="text-xs tracking-wider uppercase text-stone-500 hover:text-slate-900 flex items-center gap-1 mb-6">
      <ArrowLeft size={14} /> {label}
    </button>
  );
}