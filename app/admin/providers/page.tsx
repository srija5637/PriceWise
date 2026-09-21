'use client';

import React, { useState } from 'react';
import { Radio, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { providerRegistry } from '@/lib/providers/registry';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState(providerRegistry.getHealthReports());
  const [probing, setProbing] = useState(false);

  const handleProbeAll = async () => {
    setProbing(true);
    await new Promise((r) => setTimeout(r, 600));
    setProviders(providerRegistry.getHealthReports());
    setProbing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Provider Reliability & Circuit Breakers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time latency, failure counters, and circuit breaker states (Section 87)
          </p>
        </div>

        <Button
          onClick={handleProbeAll}
          disabled={probing}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-2 font-bold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${probing ? 'animate-spin' : ''}`} />
          <span>{probing ? 'Probing...' : 'Probe All Providers'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {providers.map((p) => (
          <Card
            key={p.storeName}
            className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">
                  <Radio className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {p.storeName}
                  </h3>
                  <p className="text-[11px] text-slate-400">{p.domain}</p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                {p.circuitStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Response Latency</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {p.latencyMs} ms
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Success Rate</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {p.successRate}%
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Circuit Threshold: 3 failures</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Cooldown: 45s</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
