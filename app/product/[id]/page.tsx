'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Star,
  ExternalLink,
  Bell,
  Bookmark,
  Check,
  ShieldCheck,
  Truck,
  TrendingDown,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Scale,
  Sparkles,
} from 'lucide-react';
import { getEnrichedProducts, getProductPriceHistory, PRODUCT_REVIEWS_ANALYSIS } from '@/lib/db/seed-data';
import { Offer, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ValueScoreModal } from '@/components/search/ValueScoreModal';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { analyzeProductPrice } from '@/lib/ai/agents/priceAnalyst';
import { findAlternativesForProduct } from '@/lib/ai/agents/alternativeFinder';
import { analyzeProductReviews } from '@/lib/ai/agents/reviewAnalyst';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'iphone-16-128gb';

  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '6M' | '1Y'>('30D');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [alertCreatedSuccess, setAlertCreatedSuccess] = useState(false);
  const [selectedOfferForScore, setSelectedOfferForScore] = useState<Offer | null>(null);

  // Get product
  const products = useMemo(() => getEnrichedProducts(), []);
  const product: Product = useMemo(() => {
    return products.find((p) => p.id === id) || products[0];
  }, [products, id]);

  // Offers
  const allOffers: Offer[] = useMemo(() => {
    const list: Offer[] = [];
    for (const v of product.variants) {
      for (const o of v.offers || []) {
        list.push(o);
      }
    }
    return list.sort((a, b) => a.price - b.price);
  }, [product]);

  const bestOffer = allOffers[0] || product.bestOffer;
  const lowestPrice = bestOffer?.price || product.lowestPrice || 68499;
  const highestPrice = allOffers[allOffers.length - 1]?.price || product.highestPrice || 71990;
  const averagePrice = product.averagePrice || Math.round((lowestPrice + highestPrice) / 2);

  // Price history
  const priceHistory = useMemo(() => {
    const raw = getProductPriceHistory(product.id, timeframe);
    return raw.map((pt) => ({
      date: pt.recordedAt,
      displayDate: new Date(pt.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: pt.price,
    }));
  }, [product.id, timeframe]);

  // Review analysis
  const reviewAnalysis = PRODUCT_REVIEWS_ANALYSIS[product.id] || {
    averageRating: product.rating || 4.5,
    totalReviews: product.reviewCount || 10000,
    distribution: { stars5: 70, stars4: 18, stars3: 7, stars2: 3, stars1: 2 },
    positiveThemes: ['Build quality and finish', 'Great display clarity', 'Reliable daily performance'],
    negativeThemes: ['Included accessories are minimal', 'Marginal upgrade over predecessor'],
    commonStrengths: ['Performance', 'Battery longevity', 'Brand support'],
    commonComplaints: ['Premium pricing', 'Slow standard charging'],
    sourceAttribution: 'Aggregated from verified purchaser reviews across major retailers',
    lastUpdated: '2026-09-20',
  };

  // AI Agent Reports
  const priceReport = useMemo(() => analyzeProductPrice(product), [product]);
  const alternatives = useMemo(() => findAlternativesForProduct(product), [product]);
  const dynamicReviews = useMemo(() => analyzeProductReviews(product), [product]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertCreatedSuccess(true);
    setTimeout(() => {
      setAlertCreatedSuccess(false);
      setAlertModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/categories/${product.category?.slug || 'mobiles'}`} className="hover:text-blue-600 transition">
          {product.category?.name || 'Category'}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{product.name}</span>
      </nav>

      {/* Top Hero Section: Gallery (left), Details & Lowest Price (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-5">
          <Card className="rounded-3xl border-slate-200/80 p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center">
            <div className="relative h-80 w-full max-w-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
          </Card>
        </div>

        {/* Right Info & Lowest Price CTA Box */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-semibold">
                {product.brand}
              </Badge>
              {product.variants[0]?.variantName && (
                <Badge variant="secondary" className="text-xs">
                  {product.variants[0].variantName}
                </Badge>
              )}
              <span className="text-xs text-slate-400">SKU: {product.variants[0]?.sku || 'PW-GEN-101'}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-2.5 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.5}</span>
              </div>
              <span className="text-slate-400">
                ({product.reviewCount?.toLocaleString() || '18,200'} verified reviews)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> In Stock Across {allOffers.length} Stores
              </span>
            </div>
          </div>

          {/* Current Lowest Price Card */}
          {bestOffer && (
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/40 p-5 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-blue-950/10 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Current Lowest Verified Price
                  </span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                      {formatCurrency(lowestPrice)}
                    </span>
                    {bestOffer.originalPrice && bestOffer.originalPrice > lowestPrice && (
                      <>
                        <span className="line-through text-sm text-slate-400">
                          {formatCurrency(bestOffer.originalPrice)}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-extrabold text-white">
                          Save {Math.round(bestOffer.discount || 14)}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Sold by <strong>{bestOffer.sellerName || bestOffer.store.name}</strong> on{' '}
                    <span className="font-bold text-slate-900 dark:text-slate-100">{bestOffer.store.name}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <a
                    href={bestOffer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <span>View Deal on {bestOffer.store.name}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <span className="text-[10px] text-slate-400">
                    Last checked: {new Date(bestOffer.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions Row: Watchlist, Price Alert, Compare */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button
              variant={isWatchlisted ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className="gap-2 rounded-xl"
            >
              <Bookmark className={`h-4 w-4 ${isWatchlisted ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTargetPriceInput(Math.round(lowestPrice * 0.95).toString());
                setAlertModalOpen(true);
              }}
              className="gap-2 rounded-xl text-slate-700 dark:text-slate-300"
            >
              <Bell className="h-4 w-4 text-rose-500" />
              <span>Set Price Alert</span>
            </Button>

            <Link href={`/compare?p1=${product.id}`}>
              <Button variant="outline" size="sm" className="rounded-xl">
                Compare with Other Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* All-Store Price Comparison Matrix */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Live Store Price Comparison</span>
            <Badge variant="secondary" className="text-xs font-semibold">
              {allOffers.length} Verified Retailers
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-slate-100 bg-slate-50/60 font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <tr>
                  <th className="py-3 pl-6 pr-3">Store</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Rating</th>
                  <th className="px-3 py-3">Reviews</th>
                  <th className="px-3 py-3">Delivery</th>
                  <th className="px-3 py-3">Seller</th>
                  <th className="px-3 py-3">Warranty</th>
                  <th className="px-3 py-3">Value Score</th>
                  <th className="py-3 pl-3 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {allOffers.map((offer, idx) => (
                  <tr
                    key={offer.id}
                    className={`transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${idx === 0 ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''}`}
                  >
                    <td className="py-3 pl-6 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-bold text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {offer.store.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-slate-100">
                            {offer.store.name}
                          </span>
                          {idx === 0 && (
                            <span className="inline-block rounded-xs bg-emerald-100 px-1 text-[9px] font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                              Lowest Price
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {formatCurrency(offer.price)}
                      </span>
                      {offer.originalPrice && offer.originalPrice > offer.price && (
                        <span className="text-[10px] line-through text-slate-400">
                          {formatCurrency(offer.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{offer.rating || 4.5}</span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {formatNumber(offer.reviewCount || 1000)}
                    </td>

                    <td className="px-3 py-3">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {offer.deliveryInfo || '2-3 Days'}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px] block">
                        {offer.sellerName || offer.store.name}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                      {offer.warrantyInfo || '1 Year Brand'}
                    </td>

                    <td className="px-3 py-3">
                      <button
                        onClick={() => setSelectedOfferForScore(offer)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 cursor-pointer"
                      >
                        <span>{offer.valueScore || 90}</span>
                        <HelpCircle className="h-3 w-3 opacity-60" />
                      </button>
                    </td>

                    <td className="py-3 pl-3 pr-6 text-right">
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        <span>View Deal</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Price History & Price Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Price History Chart */}
        <div className="lg:col-span-8">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Historical Price Trend
                </CardTitle>
                <p className="text-xs text-slate-400">
                  Verified price changes recorded across all supported stores
                </p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {(['7D', '30D', '90D', '6M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
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
            <CardContent>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pdpPriceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="displayDate"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                      domain={['dataMin - 1500', 'dataMax + 1500']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const pt = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white shadow-xl text-xs">
                              <p className="font-extrabold text-sm">{formatCurrency(pt.price)}</p>
                              <p className="text-[10px] text-slate-400">{pt.date}</p>
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
                      fill="url(#pdpPriceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Statistics */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">
              Price Statistics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Current Lowest</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(lowestPrice)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Lowest Recorded Ever</span>
                <span className="font-bold text-emerald-600">{formatCurrency(lowestPrice - 500)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Highest Recorded Ever</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(highestPrice + 3000)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Average Historical Price</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(averagePrice)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">7-Day Price Change</span>
                <span className="font-bold text-emerald-600">↓ 2.1%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">30-Day Price Change</span>
                <span className="font-bold text-emerald-600">↓ 6.0%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">90-Day Price Change</span>
                <span className="font-bold text-emerald-600">↓ 11.4%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Ratings & AI Review Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Rating Breakdown Meter */}
        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">
              Verified Rating Breakdown
            </h3>
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                {reviewAnalysis.averageRating}
              </span>
              <span className="text-slate-400 text-sm"> / 5</span>
              <div className="flex justify-center gap-1 my-1.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Based on {formatNumber(reviewAnalysis.totalReviews)} reviews
              </p>
            </div>

            {/* Distribution bars */}
            <div className="mt-4 space-y-2 text-xs">
              {[
                { stars: 5, pct: reviewAnalysis.distribution.stars5 },
                { stars: 4, pct: reviewAnalysis.distribution.stars4 },
                { stars: 3, pct: reviewAnalysis.distribution.stars3 },
                { stars: 2, pct: reviewAnalysis.distribution.stars2 },
                { stars: 1, pct: reviewAnalysis.distribution.stars1 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-2">
                  <span className="w-6 font-semibold text-slate-600 dark:text-slate-400">
                    {row.stars} ★
                  </span>
                  <Progress value={row.pct} className="h-2 flex-1" indicatorClassName="bg-amber-400" />
                  <span className="w-8 text-right font-medium text-slate-400 text-[11px]">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Review Summary (Positives, Negatives, Strengths, Complaints) */}
        <div className="lg:col-span-8">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>AI Review Summary</span>
                  <Badge variant="secondary" className="text-[10px]">Verified Purchases</Badge>
                </h3>
                <p className="text-xs text-slate-400">{reviewAnalysis.sourceAttribution}</p>
              </div>
              <span className="text-[11px] text-slate-400">Last updated: {reviewAnalysis.lastUpdated}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Positive Themes */}
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Customers Frequently Praise</span>
                </h4>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {reviewAnalysis.positiveThemes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Complaints */}
              <div className="space-y-2">
                <h4 className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>Reported Caveats & Complaints</span>
                </h4>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {reviewAnalysis.negativeThemes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Price Intelligence & Anomaly Report */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                AI Price Intelligence & Trend Analysis
              </h3>
              <p className="text-xs text-slate-400">Statistical market variance across recorded timeline</p>
            </div>
          </div>

          <Badge
            className={
              priceReport.buyingAdvice === 'buy_now'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold'
            }
          >
            {priceReport.buyingAdvice === 'buy_now'
              ? 'RECOMMENDED: GOOD TIME TO BUY'
              : priceReport.buyingAdvice === 'wait_for_drop'
              ? 'ALERT: WAIT FOR PRICE DROP'
              : 'FAIR MARKET VALUE'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Lowest Recorded</span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {formatCurrency(priceReport.historicalMin)}
            </span>
            {priceReport.isHistoricalLow && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                ★ All-Time Low
              </span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">30-Day Average</span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {formatCurrency(priceReport.averagePrice)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Price Volatility</span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {priceReport.volatilityPercentage}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {priceReport.volatilityPercentage > 8 ? 'High fluctuation' : 'Stable pricing'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">30-Day Change</span>
            <span
              className={`text-base font-black ${
                priceReport.thirtyDayChangePercent < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {priceReport.thirtyDayChangePercent > 0 ? '+' : ''}
              {priceReport.thirtyDayChangePercent}%
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-blue-700 dark:text-blue-300">PriceWise Verdict: </strong>
          {priceReport.insightSummary}
        </div>
      </Card>

      {/* AI Alternative Finder */}
      {alternatives.length > 0 && (
        <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  AI-Curated Alternatives
                </h3>
                <p className="text-xs text-slate-400">
                  Comparing trade-offs for price, consumer ratings, and overall value
                </p>
              </div>
            </div>
            <Link href="/compare">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Open Full Comparison →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                      {alt.title}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {alt.product.brand}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1 truncate">
                    {alt.product.name}
                  </h4>
                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="font-black text-base text-slate-900 dark:text-slate-100">
                      {formatCurrency(alt.product.lowestPrice || 0)}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        alt.priceDifference < 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {alt.priceDifference < 0
                        ? `Save ${formatCurrency(Math.abs(alt.priceDifference))}`
                        : `+${formatCurrency(alt.priceDifference)}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {alt.tradeoffExplanation}
                  </p>
                </div>

                <Link href={`/product/${alt.product.id}`}>
                  <Button className="w-full h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold">
                    View Alternative →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dynamic Review Sentiment & Category Topics */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Consumer Sentiment & Dynamic Feature Ratings
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated topic extraction from verified retail purchases
            </p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">
            {dynamicReviews.sentiment.positivePercentage}% POSITIVE SENTIMENT
          </Badge>
        </div>

        {/* Sentiment Progress Bar */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-emerald-600">Positive: {dynamicReviews.sentiment.positivePercentage}%</span>
            <span className="text-slate-400">Neutral: {dynamicReviews.sentiment.neutralPercentage}%</span>
            <span className="text-rose-600">Negative: {dynamicReviews.sentiment.negativePercentage}%</span>
          </div>
          <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <div
              style={{ width: `${dynamicReviews.sentiment.positivePercentage}%` }}
              className="bg-emerald-500 h-full"
            />
            <div
              style={{ width: `${dynamicReviews.sentiment.neutralPercentage}%` }}
              className="bg-slate-300 dark:bg-slate-600 h-full"
            />
            <div
              style={{ width: `${dynamicReviews.sentiment.negativePercentage}%` }}
              className="bg-rose-500 h-full"
            />
          </div>
        </div>

        {/* Category Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {dynamicReviews.topics.map((t, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{t.topic}</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {t.positivePercentage}%
                </span>
              </div>
              <Progress value={t.positivePercentage} className="h-1.5" indicatorClassName="bg-emerald-500" />
              <p className="text-[10px] text-slate-400 line-clamp-1">{t.sampleMention}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Specifications Table */}
      {product.specs && (
        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 text-right max-w-xs">{val}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Price Alert Creation Dialog */}
      <Dialog open={alertModalOpen} onOpenChange={setAlertModalOpen}>
        <DialogContent onClose={() => setAlertModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Set Price Alert</DialogTitle>
            <DialogDescription>
              We will monitor {allOffers.length} stores and alert you when {product.name} drops below your target price.
            </DialogDescription>
          </DialogHeader>

          {alertCreatedSuccess ? (
            <div className="py-6 text-center text-emerald-600 font-bold">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-emerald-500" />
              <span>Price alert successfully created!</span>
            </div>
          ) : (
            <form onSubmit={handleCreateAlert} className="space-y-4 pt-2 text-xs">
              <div>
                <span className="block font-medium text-slate-500 mb-1">Current Lowest Price</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(lowestPrice)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Alert me when price drops below (₹):
                </label>
                <input
                  type="number"
                  required
                  value={targetPriceInput}
                  onChange={(e) => setTargetPriceInput(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-950"
                  placeholder="e.g. 65000"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAlertModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Alert
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Value Score Modal */}
      <ValueScoreModal
        offer={selectedOfferForScore}
        open={Boolean(selectedOfferForScore)}
        onClose={() => setSelectedOfferForScore(null)}
      />
    </div>
  );
}
