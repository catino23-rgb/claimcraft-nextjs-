'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import ClaimDetail from './ClaimDetail';
import ScopeAudit from './ScopeAudit';
import PolicyAnalysis from './PolicyAnalysis';
import PhotoGuide from './PhotoGuide';
import SupplementBuilder from './SupplementBuilder';
import NewClaim from './NewClaim';
import { Claim, ClaimFile, Screen } from '../types';
import { getDefaultClaims, loadClaims, saveClaims } from '../lib/claim-storage';

interface ClaimCraftAppProps {
  userEmail: string | null;
  fullName: string | null;
  organizationName: string | null;
}

export default function ClaimCraftApp({ userEmail, fullName, organizationName }: ClaimCraftAppProps) {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [claims, setClaims] = useState<Claim[]>(getDefaultClaims());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadClaims();
    setClaims(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveClaims(claims);
    }
  }, [claims, hydrated]);

  const openClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setScreen('claim');
  };

  const createClaim = (incoming: { address: string; type: string; date: string; carrier: string; files: ClaimFile[] }) => {
    const initialOffer = 9500;
    const estimatedValue = 19600;
    const newClaim: Claim = {
      id: Date.now(),
      address: incoming.address,
      type: incoming.type,
      date: incoming.date,
      status: 'Photos Complete',
      carrier: incoming.carrier,
      initialOffer,
      estimatedValue,
      gap: estimatedValue - initialOffer,
      files: incoming.files
    };

    setClaims((prev) => [...prev, newClaim]);
    setSelectedClaim(newClaim);
    setScreen('claim');
  };

  const updateClaim = (updatedClaim: Claim) => {
    setClaims((prev) => prev.map((claim) => (claim.id === updatedClaim.id ? updatedClaim : claim)));
    setSelectedClaim(updatedClaim);
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <Header
        screen={screen}
        setScreen={setScreen}
        userEmail={userEmail}
        fullName={fullName}
        organizationName={organizationName}
      />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {screen === 'dashboard' && <Dashboard claims={claims} onOpen={openClaim} setScreen={setScreen} />}
        {screen === 'claim' && selectedClaim && <ClaimDetail claim={selectedClaim} setScreen={setScreen} onUpdateClaim={updateClaim} />}
        {screen === 'new' && <NewClaim setScreen={setScreen} onCreateClaim={createClaim} />}
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
