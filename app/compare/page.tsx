'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Scale, Plus, X, Star, ExternalLink, ArrowRight } from 'lucide-react';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialP1 = searchParams.get('p1');

  const allProducts = useMemo(() => getEnrichedProducts(), []);

  // Selected products to compare (up to 4)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialP1) {
      const other = allProducts.find((p) => p.id !== initialP1)?.id;
      return other ? [initialP1, other] : [initialP1];
    }
    return [allProducts[0].id, allProducts[4]?.id || allProducts[1].id];
  });

  const selectedProducts: Product[] = useMemo(() => {
    return selectedIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [selectedIds, allProducts]);

  const handleRemoveProduct = (id: string) => {
    if (selectedIds.length <= 1) return;
    setSelectedIds(selectedIds.filter((pId) => pId !== id));
  };

  const handleAddProduct = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 4) return;
    setSelectedIds([...selectedIds, id]);
  };

  // Extract all unique spec keys across selected products
  const specKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const p of selectedProducts) {
      if (p.specs) {
        Object.keys(p.specs).forEach((k) => keys.add(k));
      }
    }
    return Array.from(keys);
  }, [selectedProducts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Scale className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Compare Products
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Side-by-side multi-store comparison across specifications, real prices, and Value Scores
          </p>
        </div>

        {/* Add Product Dropdown */}
        {selectedProducts.length < 4 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Add to compare:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddProduct(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <option value="" disabled>
                Select product...
              </option>
              {allProducts
                .filter((p) => !selectedIds.includes(p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Matrix Table */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="p-4 w-44 font-bold text-slate-500">Feature</th>
                  {selectedProducts.map((prod) => (
                    <th key={prod.id} className="p-4 min-w-[220px] align-top">
                      <div className="relative flex flex-col items-center text-center">
                        {selectedProducts.length > 1 && (
                          <button
                            onClick={() => handleRemoveProduct(prod.id)}
                            className="absolute -top-2 right-0 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800"
                            title="Remove from comparison"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2 mb-2 dark:border-slate-800 dark:bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{prod.brand}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {/* Lowest Price Row */}
                <tr className="bg-emerald-50/20 dark:bg-emerald-950/10">
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Lowest Price</td>
                  {selectedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 text-center">
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                        {formatCurrency(prod.lowestPrice || 0)}
                      </span>
                      {prod.bestOffer && (
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          on {prod.bestOffer.store.name}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Overall Value Score Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Value Score</td>
                  {selectedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 text-center">
                      <span className="inline-flex items-center justify-center h-8 w-10 rounded-lg bg-blue-50 font-black text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                        {prod.bestOffer?.valueScore || 90}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Customer Rating Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Customer Rating</td>
                  {selectedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{prod.rating || 4.5}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({prod.reviewCount?.toLocaleString() || '10,000+'})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stores Available Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Verified Stores</td>
                  {selectedProducts.map((prod) => {
                    const storeNames = Array.from(
                      new Set(
                        prod.variants.flatMap((v) => (v.offers || []).map((o) => o.store.name))
                      )
                    );
                    return (
                      <td key={prod.id} className="p-4 text-center text-xs text-slate-600 dark:text-slate-300">
                        {storeNames.join(', ') || 'Flipkart, Amazon'}
                      </td>
                    );
                  })}
                </tr>

                {/* Category-Specific Dynamic Specification Rows */}
                {specKeys.map((key) => (
                  <tr key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">{key}</td>
                    {selectedProducts.map((prod) => (
                      <td key={prod.id} className="p-4 text-center text-xs font-medium">
                        {prod.specs?.[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Action Row */}
                <tr className="bg-slate-50/40 dark:bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Direct Actions</td>
                  {selectedProducts.map((prod) => (
                    <td key={prod.id} className="p-4 text-center space-y-2">
                      <Link href={`/product/${prod.id}`}>
                        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                          <span>View Product</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                      {prod.bestOffer && (
                        <a
                          href={prod.bestOffer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button size="sm" className="w-full rounded-xl text-xs bg-blue-600 hover:bg-blue-700">
                            <span>View Deal ({prod.bestOffer.store.name})</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading comparison matrix...</div>}>
      <CompareContent />
    </Suspense>
  );
}
