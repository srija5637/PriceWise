'use client';

import React from 'react';
import { BarChart3, TrendingUp, Search, Eye, MousePointerClick, Bell, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  const topQueries = [
    { query: 'iPhone 16 Pro', count: 1840, category: 'Smartphones' },
    { query: 'MacBook Air M3', count: 1420, category: 'Laptops' },
    { query: 'Sony WH-1000XM5', count: 980, category: 'Audio' },
    { query: 'Samsung Galaxy S24', count: 860, category: 'Smartphones' },
    { query: 'LG OLED C3 55-inch', count: 640, category: 'Televisions' },
    { query: 'iPad Air M2', count: 510, category: 'Tablets' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          Aggregated Shopping Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Daily rollups of search volume, comparison actions, and conversion intent (Section 66)
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Daily Searches</span>
            <Search className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">8,420</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            +18% from last week
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Product Page Views</span>
            <Eye className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">19,650</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            +12% from last week
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Store Outbound Clicks</span>
            <MousePointerClick className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">4,120</div>
          <div className="mt-1 text-xs text-slate-400 font-medium">
            21% conversion rate
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Active Alerts Triggered</span>
            <Bell className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">384</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            ₹4.2L consumer savings
          </div>
        </Card>
      </div>

      {/* Top Search Queries */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          Top Searched Products (Aggregated)
        </h3>
        <div className="space-y-3">
          {topQueries.map((item, index) => (
            <div
              key={item.query}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-950/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-[11px] text-slate-700 dark:text-slate-300">
                  #{index + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.query}</span>
                  <span className="ml-2 text-[10px] text-slate-400">({item.category})</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {item.count.toLocaleString()} searches
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
