'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { INITIAL_TRACKED_PRODUCTS } from '@/lib/alerts';
import { formatCurrency } from '@/lib/utils';

export function TrackedProductsTable() {
  const items = INITIAL_TRACKED_PRODUCTS;

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
          Your Tracked Products
        </CardTitle>
        <Link
          href="/watchlist"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-y border-slate-100 bg-slate-50/60 font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="py-2.5 pl-6 pr-3">Product</th>
                <th className="px-3 py-2.5">Current Price</th>
                <th className="px-3 py-2.5">Lowest Price</th>
                <th className="px-3 py-2.5">Price Change</th>
                <th className="px-3 py-2.5">Best Deal</th>
                <th className="py-2.5 pl-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  {/* Product Info */}
                  <td className="py-3 pl-6 pr-3">
                    <Link href={`/product/${item.product.id}`} className="flex items-center gap-3 group">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.product.brand}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Current Price */}
                  <td className="px-3 py-3 font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.currentPrice)}
                  </td>

                  {/* Lowest Price */}
                  <td className="px-3 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.lowestPrice)}
                  </td>

                  {/* Price Change */}
                  <td className="px-3 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                    ↓ {Math.abs(item.priceChangePercent)}%
                  </td>

                  {/* Best Deal with store info */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 font-bold text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.bestStore.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-900 dark:text-slate-100">
                          {item.bestStore.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatCurrency(item.currentPrice)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-3 pr-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link href={`/product/${item.product.id}?action=alert`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">Set Alert</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Options</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
