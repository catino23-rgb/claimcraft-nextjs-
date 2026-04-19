'use client';

import { AlertTriangle } from 'lucide-react';
import { Claim } from '../types';
import BackButton from './BackButton';

interface PolicyAnalysisProps {
  claim: Claim;
  setScreen: (screen: string) => void;
}

function PolicySummaryCard({ label, value, note, highlight }: { label: string; value: string; note: string; highlight?: boolean }) {
  return (
    <div className={`p-4 ${highlight ? 'bg-slate-900 text-amber-500' : 'bg-white border border-stone-200'}`}>
      <div className={`text-[10px] tracking-widest uppercase font-semibold mb-1 ${highlight ? 'text-stone-400' : 'text-stone-500'}`}>{label}</div>
      <div className={`text-xl ${highlight ? 'text-amber-500' : 'text-slate-900'}`} style={{ fontFamily: 'Georgia, serif' }}>{value}</div>
      <div className={`text-xs mt-1 ${highlight ? 'text-stone-400' : 'text-stone-500'}`}>{note}</div>
    </div>
  );
}

function ClauseRow({ tag, title, detail, impact }: { tag: string; title: string; detail: string; impact: string }) {
  return (
    <div className="border-l-2 border-amber-500 pl-4">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5">{tag}</span>
        <span className="text-sm font-semibold text-slate-900">{title}</span>
      </div>
      <div className="text-sm text-stone-700 mb-1">{detail}</div>
      <div className="text-xs text-emerald-700 font-semibold">→ {impact}</div>
    </div>
  );
}

export default function PolicyAnalysis({ claim, setScreen }: PolicyAnalysisProps) {
  return (
    <div>
      <BackButton setScreen={setScreen} to="claim" label="Back to Claim" />

      <div className="mb-6">
        <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">Policy Analysis</div>
        <h1 className="text-2xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>HO-3 · State Farm · Policy #SF-2847291</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <PolicySummaryCard label="Dwelling (Cov A)" value="$385,000" note="RCV" />
        <PolicySummaryCard label="Deductible" value="1% ($3,850)" note="Wind/Hail separate" highlight />
        <PolicySummaryCard label="Ord. & Law (Cov D)" value="$50,000" note="10% of Cov A" />
      </div>

      <div className="bg-white border border-stone-200 p-6 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Key Clauses Extracted</h2>
        <div className="space-y-3">
          <ClauseRow tag="MATCHING" title="Matching of Undamaged Property" detail="Policy §I.A.2 — 'When the damaged property cannot be reasonably matched, we will pay to replace the undamaged portions to create a uniform appearance.' Texas statute 2210.272 reinforces this right." impact="Supports full-slope replacement argument" />
          <ClauseRow tag="ORD&LAW" title="Ordinance & Law Coverage" detail="Cov D provides $50,000 for increased costs due to code enforcement. Applies to: ice & water shield, drip edge, enhanced decking, modern attachment." impact="Funds every code-driven supplement item" />
          <ClauseRow tag="RCV/ACV" title="ACV with RCV Holdback" detail="Initial payment is ACV (depreciated). RCV holdback released upon proof of completed repairs within 180 days of loss." impact="$4,200 depreciation recoverable on completion" />
          <ClauseRow tag="ALE" title="Additional Living Expenses" detail="Cov C · $38,500 limit · applies if dwelling uninhabitable during repairs. Not typically applicable to roof-only claim unless interior damage occurs." impact="Not applicable this claim" />
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm mb-4">
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-red-700 mb-1 flex items-center gap-2">
          <AlertTriangle size={14} /> Exclusions to Review
        </div>
        Wear &amp; tear exclusion (§II.B.4) and maintenance exclusion (§II.B.7) are the two clauses carriers cite most often on this claim type. Photos must clearly show hail-pattern damage, not granule loss consistent with age.
      </div>
    </div>
  );
}