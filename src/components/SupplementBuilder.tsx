'use client';

import { Eye } from 'lucide-react';
import { Claim } from '../types';
import BackButton from './BackButton';

interface SupplementBuilderProps {
  claim: Claim;
  setScreen: (screen: string) => void;
}

export default function SupplementBuilder({ claim, setScreen }: SupplementBuilderProps) {
  return (
    <div>
      <BackButton setScreen={setScreen} to="claim" label="Back to Claim" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">Supplement Letter</div>
          <h1 className="text-2xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Draft · Ready for Review</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-stone-300 text-stone-700 tracking-wider uppercase hover:border-slate-900">Export DOCX</button>
          <button className="px-4 py-2 text-sm bg-slate-900 text-amber-500 tracking-wider uppercase font-semibold hover:bg-slate-800">Send to Client</button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 p-8 font-serif text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="mb-6">
          <div className="font-bold">Acme Public Adjusting, LLC</div>
          <div className="text-stone-600">On behalf of: Harrison Family Trust</div>
          <div className="text-stone-600">Property: 142 Maple Ridge Dr, Austin TX</div>
          <div className="text-stone-600">Claim #: SF-2847291 · Date of Loss: March 28, 2026</div>
        </div>

        <div className="mb-4">
          <div className="font-bold">To: State Farm Claims Department</div>
          <div>Re: <span className="font-semibold">Supplement Request — Claim #SF-2847291</span></div>
        </div>

        <div className="mb-4">Dear Claims Representative,</div>

        <div className="mb-4">
          This supplement is submitted on behalf of the insured regarding the above-referenced claim. Following a detailed review of the carrier's estimate of April 2, 2026, photographic documentation of the loss, and applicable code requirements, the following items are respectfully submitted for inclusion or correction.
        </div>

        <div className="mb-4 space-y-3">
          <div>
            <div className="font-bold">1. Ice &amp; Water Shield — Code-Required Addition (+$1,850)</div>
            <div className="text-stone-700">The property is located in Travis County, Texas, which falls within the climate zone requiring ice &amp; water shield installation per 2021 IRC §R905.1.2 (adopted by reference in City of Austin Building Code). This item was not included in the original scope and is required by code; coverage applies under Ordinance &amp; Law provisions of the policy.</div>
          </div>
          <div>
            <div className="font-bold">2. Drip Edge — Code-Required Addition (+$504)</div>
            <div className="text-stone-700">2021 IRC §R905.2.8.5 requires drip edge at eaves and rakes on asphalt shingle roofs. Approximately 210 linear feet at local market rate of $2.40/LF.</div>
          </div>
          <div>
            <div className="font-bold">3. Matching of Undamaged Slopes — Policy &amp; Statutory (+$6,400)</div>
            <div className="text-stone-700">Per policy §I.A.2 and Texas Insurance Code §2210.272, the insurer must provide a reasonable match. Damaged and undamaged slopes are visible from common vantage points (photographic evidence attached, ref: Photos 12–17). Request inclusion of south and east slopes to achieve uniform appearance.</div>
          </div>
          <div className="italic text-stone-500">…11 additional line items documented on attached scope addendum…</div>
        </div>

        <div className="mb-4">
          <strong>Total supplement request: $15,260.</strong> Supporting documentation (photographs, code citations, local pricing quotes) is attached.
        </div>

        <div className="mb-4">
          We appreciate your prompt review and look forward to resolution. Please direct any questions to the undersigned.
        </div>

        <div>
          <div>Respectfully,</div>
          <div className="mt-4 font-bold">Josh Matthews, LPA</div>
          <div className="text-stone-600 text-xs">Licensed Public Adjuster · TX #PA-20394 · on behalf of the insured</div>
        </div>
      </div>

      <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 text-sm">
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 mb-1 flex items-center gap-2">
          <Eye size={14} /> Review Before Sending
        </div>
        ClaimCraft generated this draft from your scope audit findings. Review every citation, every dollar figure, and every factual claim. You are the licensed professional; the software is the drafting assistant.
      </div>
    </div>
  );
}