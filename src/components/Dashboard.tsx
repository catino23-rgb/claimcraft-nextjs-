'use client';

import { Plus, ChevronRight, Upload, FileSearch, AlertTriangle, Send } from 'lucide-react';
import type { Claim, Screen } from '../types';

interface DashboardProps {
  claims: Claim[];
  onOpen: (claim: Claim) => void;
  setScreen: (screen: Screen) => void;
}

function StatCard({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className={`p-5 ${highlight ? 'bg-slate-900 text-amber-500' : 'bg-white border border-stone-200'}`}>
      <div className={`text-2xl ${highlight ? 'text-amber-500' : 'text-slate-900'}`} style={{ fontFamily: 'Georgia, serif' }}>{value}</div>
      <div className={`text-[10px] tracking-widest uppercase font-semibold mt-1 ${highlight ? 'text-stone-300' : 'text-stone-500'}`}>{label}</div>
    </div>
  );
}

function WorkflowStep({ num, icon: Icon, title, desc }: { num: string; icon: any; title: string; desc: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold text-amber-700 tracking-wider">{num}</span>
        <Icon size={14} className="text-amber-700" />
      </div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-xs text-stone-600">{desc}</div>
    </div>
  );
}

export default function Dashboard({ claims, onOpen, setScreen }: DashboardProps) {
  const totalGap = claims.reduce((s, c) => s + c.gap, 0);
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">Dashboard</div>
          <h1 className="text-3xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Active Claims</h1>
        </div>
        <button onClick={() => setScreen('new')} className="bg-slate-900 text-amber-500 px-5 py-2.5 text-sm tracking-wider uppercase font-semibold hover:bg-slate-800 transition flex items-center gap-2">
          <Plus size={16} /> New Claim
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard value={`${claims.length}`} label="Active Claims" />
        <StatCard value={`$${claims.reduce((total, claim) => total + claim.initialOffer, 0).toLocaleString()}`} label="Initial Offers" />
        <StatCard value={`$${claims.reduce((total, claim) => total + claim.estimatedValue, 0).toLocaleString()}`} label="Est. Rightful Value" />
        <StatCard value={`$${totalGap.toLocaleString()}`} label="Recovery Gap" highlight />
      </div>

      <div className="bg-white border border-stone-200">
        <div className="grid grid-cols-12 bg-slate-900 text-stone-100 text-[10px] tracking-[0.15em] uppercase font-bold py-2.5 px-4">
          <div className="col-span-4">Property</div>
          <div className="col-span-2">Damage</div>
          <div className="col-span-2">Carrier</div>
          <div className="col-span-2 text-right">Gap</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {claims.map((c, i) => (
          <button key={c.id} onClick={() => onOpen(c)} className={`grid grid-cols-12 w-full text-left py-4 px-4 items-center hover:bg-amber-50 transition border-b border-stone-100 ${i % 2 === 1 ? 'bg-stone-50' : ''}`}>
            <div className="col-span-4">
              <div className="text-sm font-semibold text-slate-900">{c.address}</div>
              <div className="text-xs text-stone-500">{c.date}</div>
            </div>
            <div className="col-span-2 text-sm text-stone-700">{c.type}</div>
            <div className="col-span-2 text-sm text-stone-700">{c.carrier}</div>
            <div className="col-span-2 text-right">
              <div className="text-sm font-semibold text-amber-700">+${c.gap.toLocaleString()}</div>
              <div className="text-xs text-stone-500">${c.initialOffer.toLocaleString()} offered</div>
            </div>
            <div className="col-span-2 text-right flex items-center justify-end gap-2">
              <span className="text-xs text-stone-600">{c.status}</span>
              <ChevronRight size={16} className="text-amber-600" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-5">
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 mb-1">How ClaimCraft Works</div>
        <div className="grid grid-cols-4 gap-4 mt-3">
          <WorkflowStep num="01" icon={Upload} title="Upload" desc="Policy, carrier estimate, photos" />
          <WorkflowStep num="02" icon={FileSearch} title="Analyze" desc="AI extracts coverage, pricing, scope" />
          <WorkflowStep num="03" icon={AlertTriangle} title="Flag" desc="Missing line items, code gaps, pricing" />
          <WorkflowStep num="04" icon={Send} title="Supplement" desc="Generate formal letter with citations" />
        </div>
      </div>
    </div>
  );
}