'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Star, HelpCircle, ArrowUpDown, Search } from 'lucide-react';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product, Offer, FilterState } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StoreSearchProgress } from '@/components/search/StoreSearchProgress';
import { SearchFilters } from '@/components/search/SearchFilters';
import { ValueScoreModal } from '@/components/search/ValueScoreModal';
import { ProviderStoreStatus } from '@/lib/providers/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || '';
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const [selectedOfferForScore, setSelectedOfferForScore] = useState<Offer | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    priceMin: undefined,
    priceMax: undefined,
    brands: [],
    stores: [],
    minRating: undefined,
    minDiscount: undefined,
    inStockOnly: false,
    fastDeliveryOnly: false,
    sortBy: 'lowest_price',
  });

  // Query matching products and all their offers
  const allProducts = useMemo(() => getEnrichedProducts(), []);

  const matchedProduct: Product | undefined = useMemo(() => {
    if (!query) return allProducts[0];
    const qLower = query.toLowerCase();
    return allProducts.find(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.brand.toLowerCase().includes(qLower) ||
        qLower.includes(p.name.toLowerCase()) ||
        qLower.includes(p.model.toLowerCase())
    ) || allProducts[0];
  }, [allProducts, query]);

  // Collect all offers matching the query/product
  const rawOffers: Offer[] = useMemo(() => {
    if (!matchedProduct) return [];
    const offers: Offer[] = [];
    for (const v of matchedProduct.variants) {
      for (const o of v.offers || []) {
        offers.push(o);
      }
    }
    return offers;
  }, [matchedProduct]);

  // Generate verified provider store statuses
  const storeStatuses: ProviderStoreStatus[] = useMemo(() => {
    const stores = ['Flipkart', 'Amazon', 'Croma', 'Reliance Digital', 'Vijay Sales'];
    return stores.map((storeName) => {
      const count = rawOffers.filter((o) => o.store.name === storeName).length;
      return {
        storeName,
        status: count > 0 ? 'success' : 'skipped',
        offerCount: count,
      };
    });
  }, [rawOffers]);

  // Extract available brands and stores for filters
  const availableStores = useMemo(() => {
    return Array.from(new Set(rawOffers.map((o) => o.store.name)));
  }, [rawOffers]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.brand)));
  }, [allProducts]);

  // Apply filters and sorting
  const filteredOffers = useMemo(() => {
    let list = [...rawOffers];

    if (filters.priceMin !== undefined) {
      list = list.filter((o) => o.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      list = list.filter((o) => o.price <= filters.priceMax!);
    }
    if (filters.stores.length > 0) {
      list = list.filter((o) => filters.stores.includes(o.store.name));
    }
    if (filters.minRating !== undefined) {
      list = list.filter((o) => (o.rating || 0) >= filters.minRating!);
    }
    if (filters.inStockOnly) {
      list = list.filter((o) => o.availability === 'In Stock');
    }
    if (filters.fastDeliveryOnly) {
      list = list.filter((o) =>
        o.deliveryInfo?.toLowerCase().includes('tomorrow') ||
        o.deliveryInfo?.toLowerCase().includes('today') ||
        o.deliveryInfo?.toLowerCase().includes('2 day')
      );
    }

    // Sort
    list.sort((a, b) => {
      if (filters.sortBy === 'lowest_price') return a.price - b.price;
      if (filters.sortBy === 'highest_price') return b.price - a.price;
      if (filters.sortBy === 'highest_rating') return (b.rating || 0) - (a.rating || 0);
      if (filters.sortBy === 'most_reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (filters.sortBy === 'biggest_discount') return (b.discount || 0) - (a.discount || 0);
      if (filters.sortBy === 'best_value') return (b.valueScore || 0) - (a.valueScore || 0);
      return 0;
    });

    return list;
  }, [rawOffers, filters]);

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Search Results for &ldquo;{query || 'All Products'}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time price intelligence across supported e-commerce retailers
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
            }
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="lowest_price">Lowest Price</option>
            <option value="highest_price">Highest Price</option>
            <option value="best_value">Best Value Score</option>
            <option value="highest_rating">Highest Rating</option>
            <option value="most_reviews">Most Reviews</option>
            <option value="biggest_discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Inline Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!searchInput.trim()) return;
          router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }}
        className="relative flex items-center max-w-xl"
      >
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search another product, brand or model... (e.g. Sony headphones, MacBook)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-24 text-sm font-medium text-slate-900 shadow-xs transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
        <Button
          type="submit"
          className="absolute right-1.5 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 text-xs font-semibold text-white shadow-2xs cursor-pointer"
        >
          Search
        </Button>
      </form>

      {/* Store Verification Progress */}
      <StoreSearchProgress
        statuses={storeStatuses}
        storesCheckedCount={availableStores.length || 4}
      />

      {/* Product Summary Card */}
      {matchedProduct && (
        <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={matchedProduct.imageUrl}
                alt={matchedProduct.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {matchedProduct.brand}
                </Badge>
                {matchedProduct.category && (
                  <Badge variant="secondary" className="text-[10px]">
                    {matchedProduct.category.name}
                  </Badge>
                )}
              </div>
              <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                {matchedProduct.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">
                {matchedProduct.description}
              </p>
              <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{matchedProduct.rating || 4.5}</span>
                </span>
                <span className="text-slate-400">
                  ({matchedProduct.reviewCount?.toLocaleString() || '18,200'} reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 dark:text-slate-300">
                  Lowest Price:{' '}
                  <strong className="text-blue-600 dark:text-blue-400 font-bold">
                    {formatCurrency(matchedProduct.lowestPrice || 68499)}
                  </strong>
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <Link href={`/product/${matchedProduct.id}`}>
                <Button className="rounded-xl font-semibold shadow-xs">
                  View Full Analysis
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Main Grid: Filter sidebar on left, Offers table on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filters */}
        <div className="lg:col-span-3">
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            availableBrands={availableBrands}
            availableStores={availableStores}
          />
        </div>

        {/* Right Offers Table */}
        <div className="lg:col-span-9 space-y-4">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Compare Prices Across Stores ({filteredOffers.length} offers)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredOffers.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No matching offers found with the current filters.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting the price range or resetting filters.
                  </p>
                </div>
              ) : (
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
                        <th className="px-3 py-3">Value Score</th>
                        <th className="py-3 pl-3 pr-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {filteredOffers.map((offer) => (
                        <tr
                          key={offer.id}
                          className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          {/* Store */}
                          <td className="py-3.5 pl-6 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-bold text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {offer.store.name.charAt(0)}
                              </div>
                              <div>
                                <span className="block font-bold text-slate-900 dark:text-slate-100">
                                  {offer.store.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {offer.store.domain}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Price & MRP */}
                          <td className="px-3 py-3.5">
                            <span className="block font-extrabold text-sm text-slate-900 dark:text-slate-100">
                              {formatCurrency(offer.price)}
                            </span>
                            {offer.originalPrice && offer.originalPrice > offer.price && (
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="line-through text-slate-400">
                                  {formatCurrency(offer.originalPrice)}
                                </span>
                                <span className="font-bold text-emerald-600">
                                  {Math.round(offer.discount || 10)}% off
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Rating */}
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{offer.rating || 4.5}</span>
                            </div>
                          </td>

                          {/* Reviews */}
                          <td className="px-3 py-3.5 text-slate-600 dark:text-slate-400">
                            {formatNumber(offer.reviewCount || 1000)}
                          </td>

                          {/* Delivery */}
                          <td className="px-3 py-3.5">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {offer.deliveryInfo || 'Standard (2-3 days)'}
                            </span>
                          </td>

                          {/* Seller */}
                          <td className="px-3 py-3.5">
                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px] block">
                              {offer.sellerName || offer.store.name}
                            </span>
                          </td>

                          {/* Value Score with Clickable Trigger */}
                          <td className="px-3 py-3.5">
                            <button
                              onClick={() => setSelectedOfferForScore(offer)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 cursor-pointer"
                            >
                              <span>{offer.valueScore || 90}</span>
                              <HelpCircle className="h-3 w-3 opacity-60" />
                            </button>
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 pl-3 pr-6 text-right">
                            <a
                              href={offer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Value Score Modal */}
      <ValueScoreModal
        offer={selectedOfferForScore}
        open={Boolean(selectedOfferForScore)}
        onClose={() => setSelectedOfferForScore(null)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
