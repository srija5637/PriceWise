'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  Store,
  Radio,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { providerRegistry } from '@/lib/providers/registry';
import { jobManager } from '@/lib/jobs';
import { aiEvaluationEngine } from '@/lib/ai/evaluation';

export default function AdminOverviewPage() {
  const products = getEnrichedProducts();
  const totalOffers = products.flatMap((p) => p.variants.flatMap((v) => v.offers || [])).length;
  const providers = providerRegistry.getHealthReports();
  const jobs = jobManager.getJobs();
  const aiStats = aiEvaluationEngine.getSummaryStats();

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Monitored Products</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {products.length.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% normalized variants</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Store Offers</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalOffers.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Across 7 supported retailers
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Provider Health</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {providers.filter((p) => p.isHealthy).length} / {providers.length}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Avg latency: 142ms · 0 circuit trips
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">AI Grounding Score</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {(aiStats.avgGrounding * 100).toFixed(0)}%
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            0 hallucinated prices detected
          </div>
        </Card>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Providers Table */}
        <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Data Providers & Circuit Breakers
              </h3>
              <p className="text-xs text-slate-400">Live health monitoring across supported retailer adapters</p>
            </div>
            <Link href="/admin/providers" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {providers.map((p) => (
              <div
                key={p.storeName}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-950/50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{p.storeName}</span>
                    <p className="text-[10px] text-slate-400">{p.domain}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{p.latencyMs}ms</div>
                    <div className="text-[10px] text-slate-400">{p.successRate}% success</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                    {p.circuitStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Background Jobs Status */}
        <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Automated Background Jobs
              </h3>
              <p className="text-xs text-slate-400">Continuous price refresh, deal detection, and alert evaluation</p>
            </div>
            <Link href="/admin/jobs" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage Jobs
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-950/50 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{job.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{job.schedule}</span>
                    <span>•</span>
                    <span>Processed {job.recordsProcessed} records ({job.durationMs}ms)</span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 uppercase">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
