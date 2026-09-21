'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { ProviderStoreStatus } from '@/lib/providers/types';

export function StoreSearchProgress({
  statuses,
  storesCheckedCount,
}: {
  statuses: ProviderStoreStatus[];
  storesCheckedCount: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Multi-Store Intelligence Engine
          </h4>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Data verified from {storesCheckedCount} supported stores
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Comparison Ready
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {statuses.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
          >
            {item.status === 'success' ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : item.status === 'pending' ? (
              <Clock className="h-3.5 w-3.5 text-amber-500 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>{item.storeName}</span>
            {item.offerCount !== undefined && item.offerCount > 0 && (
              <span className="text-[10px] text-slate-400">({item.offerCount})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
