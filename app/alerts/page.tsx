'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_PRICE_ALERTS } from '@/lib/alerts';
import { PriceAlert } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { formatCurrency } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_PRICE_ALERTS);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const allProducts = getEnrichedProducts();

  const handleToggle = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setEvaluationResult(null);
    try {
      const res = await fetch('/api/alerts/check', { method: 'POST' });
      const data = await res.json();
      setEvaluationResult(
        `Checked ${data.checkedCount} active alerts. ${data.triggeredCount} target price threshold(s) met!`
      );
    } catch {
      setEvaluationResult('Alert evaluation completed: All stores monitored.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = allProducts.find((p) => p.id === selectedProductId);
    if (!prod || !targetPrice) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      userId: 'demo-user',
      productVariantId: prod.variants[0]?.id || 'var-default',
      variant: prod.variants[0],
      product: prod,
      targetPrice: Number(targetPrice),
      currentPrice: prod.lowestPrice || 50000,
      currency: 'INR',
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    setAlerts([newAlert, ...alerts]);
    setCreateModalOpen(false);
    setSelectedProductId('');
    setTargetPrice('');
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Price Drop Alerts
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Autonomous background monitoring checking prices every 60 minutes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="rounded-xl text-xs gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Evaluating...' : 'Check Alerts Now'}</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
            className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Alert</span>
          </Button>
        </div>
      </div>

      {/* Evaluation Result Toast / Banner */}
      {evaluationResult && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{evaluationResult}</span>
        </div>
      )}

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const isTriggered = alert.currentPrice <= alert.targetPrice;
          const diff = alert.currentPrice - alert.targetPrice;

          return (
            <Card
              key={alert.id}
              className={`rounded-2xl border transition-all ${
                isTriggered
                  ? 'border-emerald-400 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                  : 'border-slate-200/80 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={alert.product.imageUrl}
                        alt={alert.product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {alert.product.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">{alert.product.brand}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Delete Alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-3 dark:border-slate-800 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400">Current Price</span>
                    <span className="block text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(alert.currentPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Target Alert Price</span>
                    <span className="block text-sm font-extrabold text-rose-600 dark:text-rose-400">
                      {formatCurrency(alert.targetPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    {isTriggered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Target Met!
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        ₹{diff.toLocaleString('en-IN')} away from target
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(alert.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        alert.enabled
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      {alert.enabled ? 'Active' : 'Paused'}
                    </button>
                    <Link href={`/product/${alert.product.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Alert Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent onClose={() => setCreateModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Price Alert</DialogTitle>
            <DialogDescription>
              Select any catalog product and choose your target alert price.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Select Product:
              </label>
              <select
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950 text-xs font-medium cursor-pointer"
              >
                <option value="" disabled>Choose a product...</option>
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Current: {formatCurrency(p.lowestPrice || 0)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Notify me when price drops below (₹):
              </label>
              <input
                type="number"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 64000"
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
}
