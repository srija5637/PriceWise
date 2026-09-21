'use client';

import React from 'react';
import Link from 'next/link';
import {
  Grid,
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Watch,
  Gamepad2,
  Camera,
  Home,
  Shirt,
  Activity,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES, getEnrichedProducts } from '@/lib/db/seed-data';
import { Card, CardContent } from '@/components/ui/card';

const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Watch,
  Gamepad2,
  Camera,
  Home,
  Shirt,
  Activity,
  Zap,
};

export default function CategoriesPage() {
  const products = getEnrichedProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Grid className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Product Categories
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore price comparisons across all supported consumer product categories
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Zap;
          const count = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <Card className="rounded-2xl border-slate-200/80 p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 group cursor-pointer h-full flex flex-col justify-between">
                <CardContent className="p-0 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {count > 0 ? `${count} tracked products` : 'Compare popular models'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 pt-1">
                    <span>Explore deals</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
