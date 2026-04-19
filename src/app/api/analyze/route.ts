import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import type { Claim, ClaimAnalysis, ClaimFile } from '@/types';

const mockAnalysis: ClaimAnalysis = {
  summary: 'ClaimCraft analysis detected missing scope items, code-required upgrades, and pricing gaps that support a stronger supplement request. The draft includes high-priority roofing issues and carrier estimate omissions.',
  generatedAt: new Date().toISOString(),
  issues: [
    { severity: 'high', item: 'Ice & water shield missing', detail: 'Code required for climate zone and missing from the estimate.', citation: '2021 IRC §R905.1.2', value: 1850 },
    { severity: 'high', item: 'Drip edge omitted', detail: 'Required on eaves and rakes for asphalt shingles.', citation: '2021 IRC §R905.2.8.5', value: 504 },
    { severity: 'medium', item: 'Permit cost not included', detail: 'City permit cost for roof replacement is absent.', citation: 'Austin PDR 25-12-213', value: 175 },
    { severity: 'medium', item: 'Dump fees not itemized', detail: 'Two-load minimum dump costs are absent from scope.', citation: 'Local pricing quotes', value: 720 }
  ]
};

const SYSTEM_PROMPT =
  'You are an expert insurance claims analyst helping public adjusters identify missing line items and errors in carrier estimates. You have deep knowledge of building codes, Xactimate line items, and property insurance policy language.';

async function callClaude(claim: Claim, files: ClaimFile[]): Promise<ClaimAnalysis> {
  const client = new Anthropic();

  const userPrompt = `Analyze the following insurance claim for scope gaps, policy citations, and pricing issues.

Claim address: ${claim.address}
Loss type: ${claim.type}
Carrier: ${claim.carrier}
Initial offer: $${claim.initialOffer}
Estimated value: $${claim.estimatedValue}
Gap: $${claim.gap}
Files uploaded: ${files.map((file) => `${file.category}:${file.name}`).join(', ') || 'none'}

Return ONLY a JSON object (no markdown fences, no prose, no commentary) matching exactly this shape:
{
  "summary": string,
  "generatedAt": ISO 8601 timestamp string,
  "issues": [
    { "severity": "high" | "medium" | "low", "item": string, "detail": string, "citation": string, "value": number }
  ]
}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude response missing text content');
  }

  const cleaned = textBlock.text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  return JSON.parse(cleaned) as ClaimAnalysis;
}

export async function POST(request: Request) {
  const body = await request.json();
  const claim: Claim = body.claim;
  const files: ClaimFile[] = body.files || [];

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ analysis: mockAnalysis });
  }

  try {
    const analysis = await callClaude(claim, files);
    analysis.generatedAt = new Date().toISOString();
    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ analysis: mockAnalysis });
  }
}
