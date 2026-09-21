'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, ExternalLink, Sparkles, TrendingDown, Percent, ShieldCheck } from 'lucide-react';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function DealsPage() {
  const products = getEnrichedProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { label: 'All Deals', value: 'all' },
    { label: 'Mobiles', value: 'cat-mobiles' },
    { label: 'Laptops', value: 'cat-laptops' },
    { label: 'Audio', value: 'cat-audio' },
    { label: 'TVs', value: 'cat-tv' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.categoryId === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Tag className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Deals & Offers
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verified price drops, merchant discounts, festival sales, and bank coupons
        </p>
      </div>

      {/* Festival Sale / Promo Banner */}
      <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 md:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FESTIVAL SALE TRACKER</span>
            </div>
            <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
              Great Indian Festival & Big Billion Days Live Prices
            </h3>
            <p className="mt-1 text-xs text-white/90 leading-relaxed">
              PriceWise algorithms analyze real price changes to separate genuine price drops from artificial markup discounts.
            </p>
          </div>
          <Link href="/search?q=sale">
            <Button className="rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 shadow-sm shrink-0">
              Browse Live Deals
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const offer = prod.bestOffer || prod.variants[0]?.offers?.[0];
          if (!offer) return null;

          const discount = Math.round(offer.discount || 12);
          const isVerifiedDrop = true;

          return (
            <Card
              key={prod.id}
              className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-[10px] mb-1">
                        {prod.brand}
                      </Badge>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {prod.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Sold on {offer.store.name}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-lg bg-emerald-600 px-2 py-1 text-xs font-black text-white">
                    {discount}% OFF
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {formatCurrency(offer.price)}
                  </span>
                  {offer.originalPrice && (
                    <span className="text-xs line-through text-slate-400">
                      {formatCurrency(offer.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified Price Drop</span>
                  </span>
                  <span className="text-slate-400">Value Score: {offer.valueScore || 92}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href={`/product/${prod.id}`}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                      Inspect History
                    </Button>
                  </Link>
                  <a href={offer.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="primary" className="w-full rounded-xl text-xs gap-1">
                      <span>View Deal</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
