'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import ClaimDetail from '../components/ClaimDetail';
import ScopeAudit from '../components/ScopeAudit';
import PolicyAnalysis from '../components/PolicyAnalysis';
import PhotoGuide from '../components/PhotoGuide';
import SupplementBuilder from '../components/SupplementBuilder';
import NewClaim from '../components/NewClaim';
import { Claim } from '../types';

export default function ClaimCraftPrototype() {
  const [screen, setScreen] = useState('dashboard');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const claims: Claim[] = [
    { id: 1, address: '142 Maple Ridge Dr, Austin TX', type: 'Hail · Roof', date: 'Apr 12, 2026', status: 'Scope Audit Ready', carrier: 'State Farm', initialOffer: 8420, estimatedValue: 23680, gap: 15260 },
    { id: 2, address: '88 Harbor Lane, Tampa FL', type: 'Wind · Roof + Fence', date: 'Apr 8, 2026', status: 'Photos Complete', carrier: 'Citizens', initialOffer: 12300, estimatedValue: 19450, gap: 7150 },
    { id: 3, address: '2410 Oak Hollow, Denver CO', type: 'Water · Interior', date: 'Apr 3, 2026', status: 'Supplement Sent', carrier: 'USAA', initialOffer: 4800, estimatedValue: 11200, gap: 6400 }
  ];

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <Header screen={screen} setScreen={setScreen} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {screen === 'dashboard' && <Dashboard claims={claims} onOpen={(c) => { setSelectedClaim(c); setScreen('claim'); }} setScreen={setScreen} />}
        {screen === 'claim' && selectedClaim && <ClaimDetail claim={selectedClaim} setScreen={setScreen} />}
        {screen === 'new' && <NewClaim setScreen={setScreen} />}
        {screen === 'scope' && selectedClaim && <ScopeAudit claim={selectedClaim} setScreen={setScreen} />}
        {screen === 'policy' && selectedClaim && <PolicyAnalysis claim={selectedClaim} setScreen={setScreen} />}
        {screen === 'photos' && selectedClaim && <PhotoGuide claim={selectedClaim} setScreen={setScreen} />}
        {screen === 'supplement' && selectedClaim && <SupplementBuilder claim={selectedClaim} setScreen={setScreen} />}
      </main>
      <footer className="max-w-6xl mx-auto px-6 py-6 text-xs text-stone-500 border-t border-stone-200 mt-12">
        <p>ClaimCraft · Prototype · Not legal or regulatory advice · Software produces documents for review by licensed representatives</p>
      </footer>
    </div>
  );
}
