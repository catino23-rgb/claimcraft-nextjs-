'use client';

import { CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    complete: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Complete', dot: 'bg-emerald-500' },
    ready: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Ready for Review', dot: 'bg-amber-500' },
    draft: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Draft', dot: 'bg-blue-500' }
  };
  const s = map[status as keyof typeof map] || map.draft;
  return (
    <div className={`${s.bg} ${s.text} text-[10px] tracking-wider uppercase font-bold px-2 py-1 flex items-center gap-1.5`}>
      <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </div>
  );
}