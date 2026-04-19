export type Screen = 'dashboard' | 'claim' | 'new' | 'scope' | 'policy' | 'photos' | 'supplement';

export interface ClaimFile {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'policy' | 'declarations' | 'estimate' | 'photo';
  previewUrl?: string;
}

export interface ClaimIssue {
  severity: 'high' | 'medium' | 'low';
  item: string;
  detail: string;
  citation: string;
  value: number;
}

export interface ClaimAnalysis {
  summary: string;
  generatedAt: string;
  issues: ClaimIssue[];
}

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
  files?: ClaimFile[];
  analysis?: ClaimAnalysis;
}
