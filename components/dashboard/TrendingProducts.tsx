'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TRENDING = [
  {
    id: 'iphone-16-128gb',
    name: 'iPhone 16',
    surge: '↑ 32%',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=160&h=160&fit=crop&auto=format',
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air',
    surge: '↑ 28%',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&h=160&fit=crop&auto=format',
  },
  {
    id: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    surge: '↑ 25%',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=160&h=160&fit=crop&auto=format',
  },
  {
    id: 'samsung-55-qled-tv',
    name: 'Samsung TV',
    surge: '↑ 21%',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=160&h=160&fit=crop&auto=format',
  },
];

export function TrendingProducts() {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
          Trending Products
        </CardTitle>
        <Link
          href="/trending"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All →
        </Link>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRENDING.map((item, idx) => (
            <Link
              key={idx}
              href={`/product/${item.id}`}
              className="flex flex-col items-center rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 group"
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-950 transition-transform group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 text-center truncate w-full">
                {item.name}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {item.surge}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
