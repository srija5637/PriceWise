'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getProductPriceHistory } from '@/lib/db/seed-data';
import { formatCurrency } from '@/lib/utils';

export function PriceTrendWidget() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // iPhone 16 price history data
  const rawHistory = getProductPriceHistory('iphone-16-128gb', timeframe);

  const chartData = rawHistory.map((pt) => ({
    date: pt.recordedAt,
    displayDate: new Date(pt.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: pt.price,
  }));

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
          Price Trend
        </CardTitle>

        {/* Timeframe selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
          >
            <span>{timeframe === '7D' ? '7 Days' : timeframe === '30D' ? '30 Days' : '90 Days'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
              {(['7D', '30D', '90D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full rounded-lg px-2.5 py-1 text-left text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {tf === '7D' ? '7 Days' : tf === '30D' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Top Current Price Callout */}
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ₹68,499
            </span>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              ↓ 12%
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Current price • ₹9,500 less than last month
          </p>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="displayDate"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                domain={['dataMin - 2000', 'dataMax + 2000']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-white shadow-xl text-xs">
                        <p className="font-bold">{formatCurrency(data.price)}</p>
                        <p className="text-[10px] text-slate-400">{data.displayDate}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Statistics Footer Bar */}
        <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-center">
          <div>
            <span className="block text-[10px] text-slate-400">Lowest</span>
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">₹67,999</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">Highest</span>
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">₹74,999</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">Average</span>
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">₹71,240</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400">30D Change</span>
            <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400">↓ 8%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
