import React from 'react';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { AiDailyBrief } from '@/components/dashboard/AiDailyBrief';
import { StatCards } from '@/components/dashboard/StatCards';
import { TrackedProductsTable } from '@/components/dashboard/TrackedProductsTable';
import { PriceTrendWidget } from '@/components/dashboard/PriceTrendWidget';
import { RecentPriceDrops } from '@/components/dashboard/RecentPriceDrops';
import { TopStores } from '@/components/dashboard/TopStores';
import { TrendingProducts } from '@/components/dashboard/TrendingProducts';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Futuristic AI Daily Shopping Brief */}
      <AiDailyBrief />

      {/* 3. 5 KPI Stat Cards */}
      <StatCards />

      {/* 3. Middle Grid: Tracked Products Table (left), Price Trend (middle), Recent Drops (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tracked Products: 6 cols */}
        <div className="lg:col-span-6">
          <TrackedProductsTable />
        </div>

        {/* Price Trend: 3 cols */}
        <div className="lg:col-span-3">
          <PriceTrendWidget />
        </div>

        {/* Recent Price Drops: 3 cols */}
        <div className="lg:col-span-3">
          <RecentPriceDrops />
        </div>
      </div>

      {/* 4. Bottom Grid: Top Stores (left), Trending Products (middle), Quick Actions (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top Stores: 5 cols */}
        <div className="lg:col-span-5">
          <TopStores />
        </div>

        {/* Trending Products: 4 cols */}
        <div className="lg:col-span-4">
          <TrendingProducts />
        </div>

        {/* Quick Actions: 3 cols */}
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
