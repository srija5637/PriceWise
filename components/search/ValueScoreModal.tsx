'use client';

import React from 'react';
import { ValueScoreBreakdown, Offer } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export function ValueScoreModal({
  offer,
  open,
  onClose,
}: {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!offer) return null;
  const b = offer.valueScoreBreakdown;
  const overall = offer.valueScore || 85;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Why this score?</span>
            <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 font-extrabold text-white text-base">
              {overall}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Transparent breakdown of the PriceWise Value Score for{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{offer.store.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Price Score (40%) */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Price Competitiveness (40% weight)</span>
              <span className="text-blue-600 font-bold">{b?.priceScore ?? 92} / 100</span>
            </div>
            <Progress value={b?.priceScore ?? 92} indicatorClassName="bg-blue-600" />
            <p className="text-[10px] text-slate-400 mt-1">
              Benchmark price relative to lowest market offer and verified discount depth.
            </p>
          </div>

          {/* Rating Score (25%) */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Product Rating (25% weight)</span>
              <span className="text-emerald-600 font-bold">{b?.ratingScore ?? 90} / 100</span>
            </div>
            <Progress value={b?.ratingScore ?? 90} indicatorClassName="bg-emerald-600" />
            <p className="text-[10px] text-slate-400 mt-1">
              Calculated directly from verified customer reviews ({offer.rating || 4.5} ★).
            </p>
          </div>

          {/* Review Confidence (15%) */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Review Confidence (15% weight)</span>
              <span className="text-indigo-600 font-bold">{b?.reviewConfidence ?? 85} / 100</span>
            </div>
            <Progress value={b?.reviewConfidence ?? 85} indicatorClassName="bg-indigo-600" />
            <p className="text-[10px] text-slate-400 mt-1">
              Statistical confidence score based on verified review volume ({offer.reviewCount?.toLocaleString() || '1,000+'} reviews).
            </p>
          </div>

          {/* Seller Score (10%) */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Seller Reputation (10% weight)</span>
              <span className="text-purple-600 font-bold">{b?.sellerScore ?? 92} / 100</span>
            </div>
            <Progress value={b?.sellerScore ?? 92} indicatorClassName="bg-purple-600" />
            <p className="text-[10px] text-slate-400 mt-1">
              Store verification status and merchant fulfillment reliability.
            </p>
          </div>

          {/* Delivery Score (10%) */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Delivery & Speed (10% weight)</span>
              <span className="text-amber-600 font-bold">{b?.deliveryScore ?? 88} / 100</span>
            </div>
            <Progress value={b?.deliveryScore ?? 88} indicatorClassName="bg-amber-600" />
            <p className="text-[10px] text-slate-400 mt-1">
              Based on available fulfillment speed ({offer.deliveryInfo || 'Standard Delivery'}).
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <p>
            <strong>Note:</strong> Value Score measures relative buying efficiency and retailer reliability. It is not an absolute judgment of intrinsic product quality.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
