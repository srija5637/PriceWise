'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DROPS = [
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    drop: '₹3,500 price drop',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&h=120&fit=crop&auto=format',
  },
  {
    id: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    drop: '₹2,000 price drop',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&h=120&fit=crop&auto=format',
  },
  {
    id: 'samsung-55-qled-tv',
    name: 'Samsung 55" QLED TV',
    drop: '₹6,500 price drop',
    time: '1d ago',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=120&h=120&fit=crop&auto=format',
  },
  {
    id: 'iphone-16-128gb',
    name: 'iPhone 15 128GB',
    drop: '₹4,000 price drop',
    time: '1d ago',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&h=120&fit=crop&auto=format',
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd Gen)',
    drop: '₹1,500 price drop',
    time: '2d ago',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=120&h=120&fit=crop&auto=format',
  },
];

export function RecentPriceDrops() {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
          Recent Price Drops
        </CardTitle>
        <Link
          href="/deals"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {DROPS.map((item, idx) => (
            <Link
              key={idx}
              href={`/product/${item.id}`}
              className="flex items-center justify-between px-6 py-2.5 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </span>
                  <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {item.drop}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-400">{item.time}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
