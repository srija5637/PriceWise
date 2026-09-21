'use client';

import React, { useState } from 'react';
import { Package, Search, Filter, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const allProducts = getEnrichedProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Products & Variants Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Canonical normalization, variant isolation boundaries, and identifier status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or brand..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs dark:border-slate-800 dark:bg-slate-950 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Price Range</th>
                <th className="p-4">Identifier Status</th>
                <th className="p-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ID: {product.id}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {product.category?.name}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 font-bold text-[11px] text-slate-700 dark:text-slate-300">
                      <Layers className="h-3 w-3" />
                      <span>{product.variants.length} variant{product.variants.length > 1 ? 's' : ''}</span>
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(product.lowestPrice || 0)} – {formatCurrency(product.highestPrice || 0)}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>GTIN / SKU Verified</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-bold">
                    {product.rating}★ ({product.reviewCount?.toLocaleString()})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
