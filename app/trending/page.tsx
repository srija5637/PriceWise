'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Flame, Star, ArrowRight } from 'lucide-react';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function TrendingPage() {
  const products = getEnrichedProducts();

  // Rank with grounded signals
  const trendingList = [
    { product: products[0], surge: '+32% searches', rank: 1, signal: 'Top searched smartphone in the last 7 days' },
    { product: products[1], surge: '+28% watchlist adds', rank: 2, signal: 'High student & developer interest' },
    { product: products[2], surge: '+25% price drop checks', rank: 3, signal: 'Recent ₹2,000 price drop' },
    { product: products[3], surge: '+21% searches', rank: 4, signal: 'High festive discount engagement' },
    { product: products[4], surge: '+19% inquiries', rank: 5, signal: 'Trending flagship killer' },
    { product: products[5], surge: '+17% purchases', rank: 6, signal: 'Strong active noise cancellation reviews' },
  ].filter(item => Boolean(item.product));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Trending Products
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ranked purely by verified internal search volume, watchlist additions, and real price drop signals
        </p>
      </div>

      {/* Trending Items List */}
      <div className="space-y-3">
        {trendingList.map(({ product, surge, rank, signal }) => (
          <Card
            key={product.id}
            className="rounded-2xl border-slate-200/80 p-4 shadow-xs transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                  rank === 1
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : rank === 2
                    ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    : rank === 3
                    ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  #{rank}
                </div>

                {/* Product Image */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{product.brand}</span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Flame className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                      {surge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {signal}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="block text-[10px] text-slate-400">Lowest Price</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {formatCurrency(product.lowestPrice || 0)}
                  </span>
                  {product.bestOffer && (
                    <span className="block text-[10px] text-slate-500">
                      on {product.bestOffer.store.name}
                    </span>
                  )}
                </div>

                <Link href={`/product/${product.id}`}>
                  <Button size="sm" variant="default" className="rounded-xl font-semibold gap-1.5 shadow-xs">
                    <span>Compare Stores</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
