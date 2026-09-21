'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const STORES_LIST = [
  { name: 'Flipkart', deals: '42 deals', letter: 'f', bg: 'bg-amber-400 text-blue-800' },
  { name: 'Amazon', deals: '38 deals', letter: 'a', bg: 'bg-white border border-slate-200 text-amber-500 font-serif' },
  { name: 'Croma', deals: '24 deals', letter: 'C', bg: 'bg-emerald-600 text-white' },
  { name: 'Reliance', deals: '18 deals', letter: 'VR', bg: 'bg-red-600 text-white' },
  { name: 'Vijay Sales', deals: '12 deals', letter: 'VS', bg: 'bg-indigo-900 text-white' },
  { name: 'Myntra', deals: '10 deals', letter: 'M', bg: 'bg-gradient-to-tr from-pink-500 to-red-500 text-white' },
];

export function TopStores() {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
          Top Stores (Best Deals)
        </CardTitle>
        <Link
          href="/deals"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All →
        </Link>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {STORES_LIST.map((store, idx) => (
            <Link
              key={idx}
              href={`/search?store=${encodeURIComponent(store.name)}`}
              className="flex flex-col items-center rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 group"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-black shadow-xs transition-transform group-hover:scale-105 ${store.bg}`}>
                {store.letter}
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 text-center truncate w-full">
                {store.name}
              </span>
              <span className="text-[10px] text-slate-400">{store.deals}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
