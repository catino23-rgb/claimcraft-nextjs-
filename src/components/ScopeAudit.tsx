'use client';

import { ChevronRight } from 'lucide-react';
import type { Claim, Screen } from '../types';
import BackButton from './BackButton';

interface ScopeAuditProps {
  claim: Claim;
  setScreen: (screen: Screen) => void;
}

function SeverityDot({ severity }: { severity: string }) {
  const map = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-stone-400' };
  return <div className={`w-2.5 h-2.5 rounded-full ${map[severity as keyof typeof map] || 'bg-stone-400'} mt-1.5`} />;
}

export default function ScopeAudit({ claim, setScreen }: ScopeAuditProps) {
  const issues = [
    { severity: 'high', item: 'Ice & water shield — not included', detail: 'Texas IRC 2021 §R905.1.2 requires ice & water shield in climate zones with avg January temp < 25°F. Travis County qualifies. Line item missing entirely.', citation: 'Code: 2021 IRC R905.1.2', value: 1850 },
    { severity: 'high', item: 'Drip edge — omitted', detail: 'IRC R905.2.8.5 requires drip edge at eaves and rakes on asphalt shingle roofs. Not in scope. Linear footage at ~210 LF × $2.40/LF.', citation: 'Code: 2021 IRC R905.2.8.5', value: 504 },
    { severity: 'high', item: 'Matching — slope isolation error', detail: 'Damaged slope is visible from other slopes per photos. TX matching statute (Tex. Ins. Code §2210.272) requires reasonable match. Full south and east slopes recommended.', citation: 'Policy §I.A.2 · Tex. Ins. Code 2210.272', value: 6400 },
    { severity: 'medium', item: 'Dump fees — not itemized', detail: 'Austin metro dump fees for tear-off roofing typically $340–$480 per load. Two-load minimum for 28sq roof. Not in carrier estimate.', citation: 'Local pricing (3 sources)', value: 720 },
    { severity: 'medium', item: 'Permit cost — absent', detail: 'City of Austin roofing permit required for any roof replacement >25% of slope. $175 permit fee not included.', citation: 'Austin PDR 25-12-213', value: 175 },
    { severity: 'medium', item: 'Detach & reset — solar panels', detail: 'Photos show 6-panel solar array on south slope. D&R not in scope. Typical cost $90/panel × 6 = $540, plus re-certification.', citation: 'Line item standard', value: 800 },
    { severity: 'low', item: 'Starter strip pricing — stale', detail: 'Carrier used Xactimate Q3 2025 pricing ($58.40/sq). Current Austin market ~$71/sq per 3 supplier quotes. Pricing dispute supportable.', citation: 'Local pricing delta', value: 126 },
    { severity: 'low', item: 'Ridge cap — 30-yr vs. 3-tab', detail: 'Existing roof is architectural laminate. Carrier priced 3-tab ridge cap. Laminate ridge cap required to match.', citation: 'ITEL matching standard', value: 185 },
    { severity: 'medium', item: 'Gutter detach & reset', detail: 'Roof replacement requires gutter D&R per manufacturer install instructions. Not in scope. ~185 LF × $2.10/LF.', citation: 'Manufacturer spec', value: 389 },
    { severity: 'low', item: 'Gable vent replacement', detail: '2 gable vents visible in photos. Standard to R&R with roof replacement; not in scope.', citation: 'Scope standard', value: 311 }
  ];
  const total = issues.reduce((s, i) => s + i.value, 0);

  return (
    <div>
      <BackButton setScreen={setScreen} to="claim" label="Back to Claim" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">Scope Audit</div>
          <h1 className="text-2xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Carrier Estimate Analysis</h1>
          <div className="text-sm text-stone-600 mt-1">State Farm Xactimate estimate · 38 line items reviewed · 14 issues flagged</div>
        </div>
        <div className="bg-slate-900 text-amber-500 px-5 py-3 text-right">
          <div className="text-[10px] tracking-widest uppercase text-stone-400">Total Gap Identified</div>
          <div className="text-2xl" style={{ fontFamily: 'Georgia, serif' }}>+${total.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 text-sm">
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 mb-1">AI Analysis Summary</div>
        Carrier scope missed 3 high-severity items (ice &amp; water shield, matching, drip edge) worth <strong>$8,754</strong>. Six medium-severity omissions add <strong>$2,793</strong>. Four low-severity pricing/line-item disputes add <strong>$933</strong>. All findings have code or pricing citations suitable for a supplement.
      </div>

      <div className="bg-white border border-stone-200">
        <div className="grid grid-cols-12 bg-slate-900 text-stone-100 text-[10px] tracking-[0.15em] uppercase font-bold py-2.5 px-4">
          <div className="col-span-1">Sev</div>
          <div className="col-span-4">Issue</div>
          <div className="col-span-5">Citation & Detail</div>
          <div className="col-span-2 text-right">Value</div>
        </div>
        {issues.map((issue, i) => (
          <div key={i} className={`grid grid-cols-12 py-4 px-4 border-b border-stone-100 ${i % 2 === 1 ? 'bg-stone-50' : ''}`}>
            <div className="col-span-1">
              <SeverityDot severity={issue.severity} />
            </div>
            <div className="col-span-4">
              <div className="text-sm font-semibold text-slate-900">{issue.item}</div>
            </div>
            <div className="col-span-5">
              <div className="text-sm text-stone-700">{issue.detail}</div>
              <div className="text-xs text-amber-700 font-semibold mt-1 tracking-wide">{issue.citation}</div>
            </div>
            <div className="col-span-2 text-right">
              <div className="text-base font-semibold text-slate-900">+${issue.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className="px-5 py-2.5 text-sm border border-stone-300 hover:border-slate-900 text-stone-700 tracking-wider uppercase">Export PDF</button>
        <button onClick={() => setScreen('supplement')} className="px-5 py-2.5 text-sm bg-slate-900 text-amber-500 tracking-wider uppercase font-semibold hover:bg-slate-800 flex items-center gap-2">
          Build Supplement <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}