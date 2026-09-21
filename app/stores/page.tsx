'use client';

import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Truck, Tag, ExternalLink, ArrowRight, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { STORES } from '@/lib/db/seed-data';

interface StoreIntelligence {
  id: string;
  name: string;
  domain: string;
  logo: string;
  totalOffersTracked: number;
  dealActivity: 'high' | 'medium' | 'moderate';
  fastDeliveryCoverage: string;
  priceCompetitiveness: string;
  avgRating: number;
  returnPolicy: string;
  supportedCategories: string[];
}

const STORE_PROFILES: StoreIntelligence[] = [
  {
    id: 'store-1',
    name: 'Flipkart',
    domain: 'flipkart.com',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&auto=format&fit=crop&q=80',
    totalOffersTracked: 42,
    dealActivity: 'high',
    fastDeliveryCoverage: 'Next-day & 2-day delivery across 19,000+ pin codes',
    priceCompetitiveness: 'Leading prices on Mobiles & Consumer Electronics',
    avgRating: 4.4,
    returnPolicy: '7 to 10 days replacement policy on verified electronics',
    supportedCategories: ['Mobiles', 'Laptops', 'Audio', 'Appliances'],
  },
  {
    id: 'store-2',
    name: 'Amazon',
    domain: 'amazon.in',
    logo: 'https://images.unsplash.com/photo-1523474255658-4af61b1614ff?w=100&auto=format&fit=crop&q=80',
    totalOffersTracked: 38,
    dealActivity: 'high',
    fastDeliveryCoverage: 'Prime Same-day & One-day shipping in metro areas',
    priceCompetitiveness: 'Frequent flash deals and competitive laptop bundles',
    avgRating: 4.5,
    returnPolicy: 'Amazon Fulfilled 7-day hassle-free return window',
    supportedCategories: ['Mobiles', 'Audio', 'Laptops', 'Wearables', 'Smart Home'],
  },
  {
    id: 'store-3',
    name: 'Croma',
    domain: 'croma.com',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&auto=format&fit=crop&q=80',
    totalOffersTracked: 24,
    dealActivity: 'medium',
    fastDeliveryCoverage: 'Express 3-hour store pickup & standard 2-3 day shipping',
    priceCompetitiveness: 'Direct Tata brand warranty & in-store servicing backup',
    avgRating: 4.6,
    returnPolicy: 'Standard brand warranty & authorized technician inspection',
    supportedCategories: ['Laptops', 'TVs', 'Audio', 'Large Appliances'],
  },
  {
    id: 'store-4',
    name: 'Reliance Digital',
    domain: 'reliancedigital.in',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop&q=80',
    totalOffersTracked: 18,
    dealActivity: 'medium',
    fastDeliveryCoverage: 'Insta Delivery from local Reliance store network',
    priceCompetitiveness: 'Exclusive offline-parity discounts and exchange bonus',
    avgRating: 4.3,
    returnPolicy: 'Authorized manufacturer warranty with ResQ service plans',
    supportedCategories: ['TVs', 'Refrigerators', 'Mobiles', 'Audio'],
  },
  {
    id: 'store-5',
    name: 'Vijay Sales',
    domain: 'vijaysales.com',
    logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100&auto=format&fit=crop&q=80',
    totalOffersTracked: 12,
    dealActivity: 'moderate',
    fastDeliveryCoverage: 'Home delivery in 2-4 business days across major cities',
    priceCompetitiveness: 'Weekend special offers and zero-cost EMI tie-ups',
    avgRating: 4.4,
    returnPolicy: '7-day replacement for manufacturing defects',
    supportedCategories: ['Appliances', 'Laptops', 'Cameras'],
  },
  {
    id: 'store-6',
    name: 'Myntra',
    domain: 'myntra.com',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop&q=80',
    totalOffersTracked: 10,
    dealActivity: 'high',
    fastDeliveryCoverage: 'Fast delivery with M-Express in tier-1 cities',
    priceCompetitiveness: 'Unbeatable coupon discounts on wearables and lifestyle',
    avgRating: 4.2,
    returnPolicy: '14-day instant return and door-step refund verification',
    supportedCategories: ['Wearables', 'Smartwatches', 'Audio'],
  },
];

export default function StoresPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <Store className="h-3.5 w-3.5" />
            <span>Retailer Monitoring Network</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-1">
          Store Intelligence & Retailer Profiles
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time analytics on pricing competitiveness, delivery speed coverage, deal frequency, and seller credibility across PriceWise-monitored stores.
        </p>
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORE_PROFILES.map((store) => (
          <Card
            key={store.id}
            className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
          >
            <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-black text-blue-600 dark:text-blue-400 text-lg">
                    {store.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {store.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {store.domain}
                    </span>
                  </div>
                </div>

                <Badge
                  className={
                    store.dealActivity === 'high'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold'
                  }
                >
                  {store.dealActivity.toUpperCase()} DEALS
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4 flex-1">
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Monitored Offers</span>
                  <span className="text-base font-black text-slate-900 dark:text-slate-100">
                    {store.totalOffersTracked} Active
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Customer Rating</span>
                  <span className="text-base font-black text-amber-500 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {store.avgRating} ★
                  </span>
                </div>
              </div>

              {/* Delivery & policy bullets */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Truck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{store.fastDeliveryCoverage}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{store.returnPolicy}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{store.priceCompetitiveness}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Core Categories
                </span>
                <div className="flex flex-wrap gap-1">
                  {store.supportedCategories.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>

            <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
              <Link href={`/search?store=${store.name}`}>
                <Button className="w-full h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs gap-1.5 cursor-pointer">
                  Browse Verified {store.name} Deals <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
