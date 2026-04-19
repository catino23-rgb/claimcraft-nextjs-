import { Claim } from '../types';

const STORAGE_KEY = 'claimcraft_claims_v1';

const defaultClaims: Claim[] = [
  { id: 1, address: '142 Maple Ridge Dr, Austin TX', type: 'Hail · Roof', date: 'Apr 12, 2026', status: 'Scope Audit Ready', carrier: 'State Farm', initialOffer: 8420, estimatedValue: 23680, gap: 15260, files: [] },
  { id: 2, address: '88 Harbor Lane, Tampa FL', type: 'Wind · Roof + Fence', date: 'Apr 8, 2026', status: 'Photos Complete', carrier: 'Citizens', initialOffer: 12300, estimatedValue: 19450, gap: 7150, files: [] },
  { id: 3, address: '2410 Oak Hollow, Denver CO', type: 'Water · Interior', date: 'Apr 3, 2026', status: 'Supplement Sent', carrier: 'USAA', initialOffer: 4800, estimatedValue: 11200, gap: 6400, files: [] }
];

export function loadClaims(): Claim[] {
  if (typeof window === 'undefined') return defaultClaims;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultClaims;
    const parsed = JSON.parse(raw) as Claim[];
    return parsed.length ? parsed : defaultClaims;
  } catch (error) {
    return defaultClaims;
  }
}

export function saveClaims(claims: Claim[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

export function getDefaultClaims() {
  return defaultClaims;
}
