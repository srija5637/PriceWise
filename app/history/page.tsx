'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LineChart as LineChartIcon, Calendar, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { getEnrichedProducts, getProductPriceHistory } from '@/lib/db/seed-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function PriceHistoryPage() {
  const allProducts = useMemo(() => getEnrichedProducts(), []);
  const [selectedProductId, setSelectedProductId] = useState(allProducts[0].id);
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '6M' | '1Y'>('30D');

  const currentProduct = useMemo(() => {
    return allProducts.find((p) => p.id === selectedProductId) || allProducts[0];
  }, [allProducts, selectedProductId]);

  const rawHistory = useMemo(() => {
    return getProductPriceHistory(currentProduct.id, timeframe);
  }, [currentProduct.id, timeframe]);

  const chartData = useMemo(() => {
    return rawHistory.map((item) => {
      // Simulate multiple store price trends over the period
      const flipkart = item.price;
      const amazon = Math.round(item.price * 1.02);
      const croma = Math.round(item.price * 1.04);
      return {
        date: item.recordedAt,
        displayDate: new Date(item.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Flipkart: flipkart,
        Amazon: amazon,
        Croma: croma,
      };
    });
  }, [rawHistory]);

  const firstPrice = rawHistory[0]?.price || 0;
  const lastPrice = rawHistory[rawHistory.length - 1]?.price || 0;
  const priceDiff = lastPrice - firstPrice;
  const percentDiff = firstPrice ? Math.round((priceDiff / firstPrice) * 100) : 0;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <LineChartIcon className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Price History Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical price trends and volatility analysis across major retailers
          </p>
        </div>

        {/* Product selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            {allProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chart Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(lastPrice)}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-xs font-bold ${
                  percentDiff <= 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {percentDiff <= 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                {Math.abs(percentDiff)}% in {timeframe}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing price histories for {currentProduct.name}
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 self-start sm:self-auto">
            {(['7D', '30D', '90D', '6M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
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
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-white shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-300">{data.date}</p>
                          <p className="text-amber-400">Flipkart: {formatCurrency(data.Flipkart)}</p>
                          <p className="text-blue-400">Amazon: {formatCurrency(data.Amazon)}</p>
                          <p className="text-emerald-400">Croma: {formatCurrency(data.Croma)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="Flipkart" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Amazon" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Croma" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
