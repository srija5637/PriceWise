'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Trash2,
  Bell,
  ExternalLink,
  Scale,
  TrendingDown,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { INITIAL_TRACKED_PRODUCTS } from '@/lib/alerts';
import { WatchlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>(INITIAL_TRACKED_PRODUCTS);
  const [filterDropsOnly, setFilterDropsOnly] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filterDropsOnly && item.priceChangePercent >= 0) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        item.product.name.toLowerCase().includes(q) ||
        item.product.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <Bookmark className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              My Watchlist
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking {items.length} saved products for instant price drop updates
          </p>
        </div>

        <Link href="/search">
          <Button size="sm" variant="primary" className="rounded-xl font-semibold gap-1.5 shadow-xs">
            <Search className="h-3.5 w-3.5" />
            <span>Track New Product</span>
          </Button>
        </Link>
      </div>

      {/* Control Bar: Search & Price Drop Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Filter saved products..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-8 text-xs dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setFilterDropsOnly(!filterDropsOnly)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filterDropsOnly
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
            <span>Price Drops Only ({items.filter((i) => i.priceChangePercent < 0).length})</span>
          </button>
        </div>
      </div>

      {/* Watchlist Grid / Table */}
      {filteredItems.length === 0 ? (
        <Card className="rounded-2xl border-slate-200/80 p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <Bookmark className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Your watchlist is empty.
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Save products here to track their prices, get notified of drops, and find the best deals.
          </p>
          <div className="mt-5">
            <Link href="/search">
              <Button variant="default" className="rounded-xl text-xs font-semibold">
                Search Products
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <tr>
                    <th className="py-3 pl-6 pr-3">Product</th>
                    <th className="px-3 py-3">Current Price</th>
                    <th className="px-3 py-3">Lowest Price</th>
                    <th className="px-3 py-3">Target Price</th>
                    <th className="px-3 py-3">Price Change</th>
                    <th className="px-3 py-3">Best Store</th>
                    <th className="py-3 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* Product */}
                      <td className="py-3.5 pl-6 pr-3">
                        <Link href={`/product/${item.product.id}`} className="flex items-center gap-3 group">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                              {item.product.name}
                            </span>
                            <span className="text-[11px] text-slate-400">{item.product.brand}</span>
                          </div>
                        </Link>
                      </td>

                      {/* Current Price */}
                      <td className="px-3 py-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.currentPrice)}
                      </td>

                      {/* Lowest Price */}
                      <td className="px-3 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.lowestPrice)}
                      </td>

                      {/* Target Price */}
                      <td className="px-3 py-3.5">
                        {item.targetPrice ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                            <Bell className="h-3 w-3" />
                            {formatCurrency(item.targetPrice)}
                          </span>
                        ) : (
                          <span className="text-slate-400">Not set</span>
                        )}
                      </td>

                      {/* Price Change */}
                      <td className="px-3 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        ↓ {Math.abs(item.priceChangePercent)}%
                      </td>

                      {/* Best Store */}
                      <td className="px-3 py-3.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.bestStore.name}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link href={`/compare?p1=${item.product.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                              title="Compare"
                            >
                              <Scale className="h-3.5 w-3.5" />
                              <span className="sr-only">Compare</span>
                            </Button>
                          </Link>

                          <Link href={`/product/${item.product.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-blue-600"
                              title="View Product"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.id)}
                            className="h-8 w-8 text-slate-400 hover:text-rose-600"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Remove</span>
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
      )}
    </div>
    </ProtectedRoute>
  );
}
