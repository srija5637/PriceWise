'use client';

import React, { useState } from 'react';
import { Store, Search, Filter, Clock, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { providerRegistry } from '@/lib/providers/registry';
import { formatCurrency } from '@/lib/utils';

export default function AdminOffersPage() {
  const products = getEnrichedProducts();
  const allOffers = products.flatMap((p) =>
    p.variants.flatMap((v) =>
      (v.offers || []).map((o) => ({
        ...o,
        productName: p.name,
        productId: p.id,
      }))
    )
  );

  const [selectedStore, setSelectedStore] = useState('all');

  const filtered = allOffers.filter((o) => {
    if (selectedStore !== 'all' && o.store.name.toLowerCase() !== selectedStore.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Active Store Offers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Total of {allOffers.length} verified listings monitored across 7 stores
          </p>
        </div>

        <div>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">All Retailers</option>
            <option value="amazon">Amazon</option>
            <option value="flipkart">Flipkart</option>
            <option value="croma">Croma</option>
            <option value="reliance digital">Reliance Digital</option>
            <option value="vijay sales">Vijay Sales</option>
            <option value="myntra">Myntra</option>
          </select>
        </div>
      </div>

      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Store</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Current Price</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Freshness</th>
                <th className="p-4">Value Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((offer) => {
                const freshness = providerRegistry.calculateFreshness(offer.lastCheckedAt);
                return (
                  <tr key={offer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {offer.store.name}
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {offer.productName}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(offer.price)}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {offer.availability}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${freshness.badgeClass}`}>
                        <Clock className="h-3 w-3" />
                        <span>{freshness.label}</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {offer.valueScore}/100
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
