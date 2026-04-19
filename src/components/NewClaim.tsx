'use client';

import { useState } from 'react';
import { ChevronRight, Upload, Zap } from 'lucide-react';
import BackButton from './BackButton';

interface NewClaimProps {
  setScreen: (screen: string) => void;
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-600 block mb-1">{label}</label>
      <input type="text" placeholder={placeholder} className="w-full border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" />
    </div>
  );
}

function UploadBox({ label, desc, optional }: { label: string; desc: string; optional?: boolean }) {
  return (
    <div className="border-2 border-dashed border-stone-300 p-5 hover:border-amber-500 transition cursor-pointer">
      <div className="flex items-center gap-3">
        <Upload size={20} className="text-stone-500" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">{label} {optional && <span className="text-xs text-stone-500 font-normal">(optional)</span>}</div>
          <div className="text-xs text-stone-600">{desc}</div>
        </div>
        <div className="text-xs tracking-wider uppercase text-amber-700 font-semibold">Browse</div>
      </div>
    </div>
  );
}

export default function NewClaim({ setScreen }: NewClaimProps) {
  const [step, setStep] = useState(1);

  return (
    <div>
      <BackButton setScreen={setScreen} />

      <div className="mb-6">
        <div className="text-[10px] tracking-[0.25em] text-amber-700 uppercase font-bold mb-1">New Claim</div>
        <h1 className="text-2xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Set Up Claim — Step {step} of 3</h1>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(n => (
          <div key={n} className={`flex-1 h-1 ${n <= step ? 'bg-amber-500' : 'bg-stone-200'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white border border-stone-200 p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Property &amp; Loss Details</h2>
          <div className="space-y-4">
            <Field label="Property Address" placeholder="Street, City, State, Zip" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Loss" placeholder="MM/DD/YYYY" />
              <Field label="Loss Type" placeholder="Hail / Wind / Water / Fire" />
            </div>
            <Field label="Carrier" placeholder="State Farm, Allstate, USAA..." />
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-slate-900 text-amber-500 text-sm tracking-wider uppercase font-semibold flex items-center gap-2">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-stone-200 p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Upload Documents</h2>
          <div className="space-y-3">
            <UploadBox label="Policy Document (PDF)" desc="Full policy including endorsements" />
            <UploadBox label="Declarations Page (PDF)" desc="Coverage limits and deductibles" />
            <UploadBox label="Carrier Estimate (PDF or XML)" desc="Xactimate or Symbility output" optional />
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-stone-300 text-sm tracking-wider uppercase text-stone-700">Back</button>
            <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-slate-900 text-amber-500 text-sm tracking-wider uppercase font-semibold flex items-center gap-2">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-stone-200 p-6 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-slate-900" />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Ready to Analyze</h2>
          <p className="text-stone-600 text-sm mb-6 max-w-md mx-auto">ClaimCraft will extract policy terms, parse the carrier estimate, and prepare the scope audit. This typically takes 90 seconds.</p>
          <button onClick={() => setScreen('dashboard')} className="px-6 py-3 bg-slate-900 text-amber-500 text-sm tracking-wider uppercase font-semibold">Start Analysis</button>
        </div>
      )}
    </div>
  );
}