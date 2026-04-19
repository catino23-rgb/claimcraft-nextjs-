'use client';

import { Camera, FileText, FileSearch, Send, ChevronRight } from 'lucide-react';
import { Claim } from '../types';
import BackButton from './BackButton';
import StatusBadge from './StatusBadge';

interface ClaimDetailProps {
  claim: Claim;
  setScreen: (screen: string) => void;
}

export default function ClaimDetail({ claim, setScreen }: ClaimDetailProps) {
  const modules = [
    { id: 'photos', icon: Camera, title: 'Photo Documentation', desc: 'Guided capture workflow with AI tagging', status: 'complete', count: '47 photos · 12 slopes tagged' },
    { id: 'policy', icon: FileText, title: 'Policy Analysis', desc: 'Declarations, endorsements, key clauses', status: 'complete', count: 'Ordinance & Law: $50K · ACV with RCV holdback' },
    { id: 'scope', icon: FileSearch, title: 'Scope Audit', desc: 'Line-by-line review of carrier estimate', status: 'ready', count: '14 issues flagged · $15,260 gap' },
    { id: 'supplement', icon: Send, title: 'Supplement Letter', desc: 'Formal supplement with citations', status: 'draft', count: '4 sections drafted · awaiting review' }
  ];

  return (
    <div>
      <BackButton setScreen={setScreen} />

      <div className="bg-white border border-stone-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">Claim #CL-{claim.id.toString().padStart(5, '0')}</div>
            <h1 className="text-2xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>{claim.address}</h1>
            <div className="text-sm text-stone-600 mt-1">{claim.type} · Filed {claim.date} · {claim.carrier}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-widest uppercase text-stone-500">Recovery Gap</div>
            <div className="text-3xl text-amber-700" style={{ fontFamily: 'Georgia, serif' }}>+${claim.gap.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div>
            <div className="text-[10px] tracking-widest uppercase text-stone-500">Initial Offer</div>
            <div className="text-lg font-semibold text-stone-700">${claim.initialOffer.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-widest uppercase text-stone-500">Estimated Rightful Value</div>
            <div className="text-lg font-semibold text-slate-900">${claim.estimatedValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-widest uppercase text-stone-500">Potential Recovery</div>
            <div className="text-lg font-semibold text-amber-700">{Math.round((claim.gap / claim.initialOffer) * 100)}% uplift</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {modules.map((m) => (
          <button key={m.id} onClick={() => setScreen(m.id)} className="bg-white border border-stone-200 p-5 text-left hover:border-amber-500 hover:shadow-sm transition group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 border border-amber-200 flex items-center justify-center">
                <m.icon size={18} className="text-amber-700" />
              </div>
              <StatusBadge status={m.status} />
            </div>
            <div className="text-base font-semibold text-slate-900">{m.title}</div>
            <div className="text-sm text-stone-600 mb-2">{m.desc}</div>
            <div className="text-xs text-stone-500 flex items-center justify-between">
              <span>{m.count}</span>
              <ChevronRight size={14} className="text-amber-600 group-hover:translate-x-1 transition" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}