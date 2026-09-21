'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingDown, ArrowRight, CheckCircle2, PackageCheck, Zap, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AiDailyBrief() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 text-white shadow-xl">
      {/* Subtle background glow */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute right-32 -bottom-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
        title="Dismiss brief"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-blue-500/30 px-3 text-[11px] font-black uppercase tracking-wider text-blue-200 border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>PriceWise Intelligence Brief</span>
            </span>
            <span className="text-xs text-blue-200/70 font-medium">Daily AI Report • Live</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Good morning, <span className="text-cyan-300">User</span>.
          </h3>

          <p className="text-sm text-slate-200/90 leading-relaxed max-w-xl">
            Our multi-store monitoring detected <strong className="text-white">3 price drops</strong>,{' '}
            <strong className="text-cyan-300">2 products at new historical lows</strong>, and{' '}
            <strong className="text-white">1 restocked variant</strong> across your tracked catalog.
          </p>

          {/* Quick Metrics Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
              <span>Samsung 55&quot; QLED hit new low ₹52,499</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>iPhone 16 ₹68,499 (₹11,401 off MRP)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <PackageCheck className="h-3.5 w-3.5 text-cyan-300" />
              <span>MacBook Air M3 in stock</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link href="/alerts">
            <Button className="w-full h-11 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 cursor-pointer">
              View Insights & Deals <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button
              variant="outline"
              className="w-full h-11 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs backdrop-blur-md cursor-pointer"
            >
              Ask AI Shopping Assistant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
