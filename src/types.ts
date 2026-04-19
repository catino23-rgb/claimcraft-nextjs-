export interface Claim {
  id: number;
  address: string;
  type: string;
  date: string;
  status: string;
  carrier: string;
  initialOffer: number;
  estimatedValue: number;
  gap: number;
}

export type Screen = 'dashboard' | 'claim' | 'new' | 'scope' | 'policy' | 'photos' | 'supplement';