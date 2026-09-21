'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { CATEGORIES, getEnrichedProducts } from '@/lib/db/seed-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = (params?.category as string) || 'mobiles';

  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
  const allProducts = useMemo(() => getEnrichedProducts(), []);

  const categoryProducts = useMemo(() => {
    return allProducts.filter((p) => p.categoryId === category.id || p.category?.slug === slug);
  }, [allProducts, category.id, slug]);

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1 text-slate-500">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Categories</span>
          </Button>
        </Link>
      </div>

      {/* Category Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          {category.name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Showing {categoryProducts.length} verified products with real-time multi-store price comparisons
        </p>

        {/* Spec tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Key Specs:</span>
          {category.specKeys.map((key) => (
            <Badge key={key} variant="secondary" className="text-[10px]">
              {key}
            </Badge>
          ))}
        </div>
      </div>

      {/* Products in this category */}
      {categoryProducts.length === 0 ? (
        <Card className="rounded-2xl border-slate-200/80 p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No products currently cataloged in this category.
          </p>
          <div className="mt-4">
            <Link href="/search">
              <Button size="sm" variant="default">
                Search All Stores
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((prod) => (
            <Card
              key={prod.id}
              className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {prod.brand}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{prod.rating || 4.5}</span>
                  </div>
                </div>

                <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-contain" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400">Lowest Price</span>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      {formatCurrency(prod.lowestPrice || 0)}
                    </span>
                  </div>
                  {prod.bestOffer && (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      on {prod.bestOffer.store.name}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href={`/product/${prod.id}`}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                      View Analysis
                    </Button>
                  </Link>
                  <Link href={`/compare?p1=${prod.id}`}>
                    <Button variant="primary" size="sm" className="w-full rounded-xl text-xs">
                      Compare
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
