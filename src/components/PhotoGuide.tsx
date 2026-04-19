'use client';

import { Camera, CheckCircle2, XCircle } from 'lucide-react';
import type { Claim, Screen } from '../types';
import BackButton from './BackButton';

interface PhotoGuideProps {
  claim: Claim;
  setScreen: (screen: Screen) => void;
}

export default function PhotoGuide({ claim, setScreen }: PhotoGuideProps) {
  const checklist = [
    { done: true, item: 'Four elevation shots (N, S, E, W)', count: '4/4' },
    { done: true, item: 'Full roof overview from ground', count: '6/6' },
    { done: true, item: 'Each slope — full slope shot', count: '5/5' },
    { done: true, item: 'Test squares (10×10) on each slope', count: '5/5' },
    { done: true, item: 'Close-ups with scale reference', count: '18/15' },
    { done: true, item: 'Soft metal damage (vents, flashing, AC fins)', count: '4/3' },
    { done: false, item: 'Interior attic/ceiling inspection', count: '0/3', note: 'Required to rule out decking damage' },
    { done: false, item: 'Gutter debris samples (collateral evidence)', count: '0/2', note: 'Supports storm date and intensity' }
  ];

  return (
    <div>
      <BackButton setScreen={setScreen} to="claim" label="Back to Claim" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">Photo Documentation</div>
          <h1 className="text-2xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Guided Capture Checklist</h1>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-slate-900 text-sm tracking-wider uppercase font-semibold hover:bg-amber-400 flex items-center gap-2">
          <Camera size={14} /> Capture More
        </button>
      </div>

      <div className="bg-white border border-stone-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-stone-600">Documentation completeness</div>
          <div className="text-lg font-semibold text-slate-900">75%</div>
        </div>
        <div className="h-2 bg-stone-200 mb-2">
          <div className="h-full bg-amber-500" style={{ width: '75%' }} />
        </div>
        <div className="text-xs text-stone-500">2 checklist items remaining before documentation is adjuster-grade</div>
      </div>

      <div className="bg-white border border-stone-200">
        {checklist.map((c, i) => (
          <div key={i} className={`flex items-start gap-4 py-3 px-4 border-b border-stone-100 ${i === checklist.length - 1 ? 'border-b-0' : ''}`}>
            {c.done ? <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle size={18} className="text-stone-300 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <div className={`text-sm ${c.done ? 'text-stone-700' : 'font-semibold text-slate-900'}`}>{c.item}</div>
              {c.note && <div className="text-xs text-amber-700 mt-0.5">{c.note}</div>}
            </div>
            <div className="text-xs text-stone-500 font-mono">{c.count}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 text-sm">
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 mb-1">Why This Matters</div>
        Adjusters and appraisers weigh photo evidence heavily. A claim with a complete documentation package has a 3–4× higher supplement approval rate than one with ad-hoc photos. Every missing checklist item is a reason the carrier can delay or deny.
      </div>
    </div>
  );
}