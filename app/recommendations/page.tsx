'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  TrendingDown,
  Star,
  ExternalLink,
  Bookmark,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { formatCurrency } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RecommendationsPage() {
  const allProducts = getEnrichedProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxBudget, setMaxBudget] = useState(150000);
  const [priority, setPriority] = useState<'value' | 'price' | 'rating'>('value');
  const [watchlistAdded, setWatchlistAdded] = useState<string | null>(null);

  const filtered = allProducts
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category?.slug !== selectedCategory) return false;
      if ((p.lowestPrice || 0) > maxBudget) return false;
      return true;
    })
    .sort((a, b) => {
      if (priority === 'price') return (a.lowestPrice || 0) - (b.lowestPrice || 0);
      if (priority === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.bestOffer?.valueScore || 0) - (a.bestOffer?.valueScore || 0);
    });

  const getReasonExplanation = (product: (typeof allProducts)[0]) => {
    const score = product.bestOffer?.valueScore || 85;
    const store = product.bestOffer?.store.name || 'Amazon';
    if (priority === 'price') {
      return `Priced at ${formatCurrency(product.lowestPrice || 0)}, making it one of the lowest entry points in ${product.category?.name}.`;
    }
    if (priority === 'rating') {
      return `Outstanding customer satisfaction rating of ${product.rating}★ across ${product.reviewCount?.toLocaleString()} verified reviews.`;
    }
    return `Balanced Value Score of ${score}/100 with verified best price on ${store} and high review confidence.`;
  };

  const handleAddToWatchlist = (id: string) => {
    setWatchlistAdded(id);
    setTimeout(() => setWatchlistAdded(null), 2000);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 px-2.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Shopping Recommendations</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Recommended For You
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Personalized product recommendations grounded strictly in verified multi-store pricing and value analytics.
            </p>
          </div>

          {/* Personalization Toggle Banner */}
          <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3.5 py-2 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Personalization: ON
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio & Headphones</option>
                <option value="televisions">Televisions</option>
                <option value="smartwatches">Smartwatches</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Maximum Budget
                </label>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(maxBudget)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={250000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Optimization Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'value' | 'price' | 'rating')}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950 font-medium"
              >
                <option value="value">Highest Value Score (Balanced)</option>
                <option value="price">Lowest Price First</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Recommended Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((product) => {
            const best = product.bestOffer;
            const score = best?.valueScore || 85;

            return (
              <Card
                key={product.id}
                className="rounded-3xl border-slate-200/80 shadow-xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {product.category?.name}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{product.rating}</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({product.reviewCount?.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold uppercase text-slate-400">Best Price</div>
                      <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                        {formatCurrency(product.lowestPrice || 0)}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        on {best?.store.name}
                      </div>
                    </div>
                  </div>

                  {/* Why this product appears disclosure tag (Section 44 & 91) */}
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-950 dark:bg-indigo-950/20 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Why this product appears in your recommendations:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {getReasonExplanation(product)}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 p-4 dark:bg-slate-950/40 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <span>Value Score: {score}/100</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToWatchlist(product.id)}
                      className="rounded-xl text-xs"
                    >
                      <Bookmark className="h-3.5 w-3.5 mr-1" />
                      <span>{watchlistAdded === product.id ? 'Added!' : 'Track'}</span>
                    </Button>
                    <Link href={`/product/${product.id}`}>
                      <Button variant="primary" size="sm" className="rounded-xl text-xs font-bold">
                        <span>Compare Prices</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
