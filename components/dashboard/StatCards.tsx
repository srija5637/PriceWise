import React from 'react';
import { Package, Bell, Wallet, Tag, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface DashboardStatsProps {
  productsTracked?: number;
  activeAlerts?: number;
  totalSavings?: number;
  priceDropsCount?: number;
  averageRating?: number;
}

export function StatCards({
  productsTracked = 12,
  activeAlerts = 5,
  totalSavings = 12450,
  priceDropsCount = 28,
  averageRating = 4.6,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Products Tracked',
      value: productsTracked.toString(),
      subtext: '↑ 3 this week',
      subtextColor: 'text-emerald-600 dark:text-emerald-400',
      icon: Package,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts.toString(),
      subtext: '↑ 2 new',
      subtextColor: 'text-emerald-600 dark:text-emerald-400',
      icon: Bell,
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
    },
    {
      label: 'Total Savings',
      value: `₹${totalSavings.toLocaleString('en-IN')}`,
      subtext: 'Since you joined',
      subtextColor: 'text-slate-400 dark:text-slate-500',
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      label: 'Price Drops',
      value: priceDropsCount.toString(),
      subtext: 'In last 30 days',
      subtextColor: 'text-slate-400 dark:text-slate-500',
      icon: Tag,
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    },
    {
      label: 'Average Rating',
      value: averageRating.toString(),
      subtext: 'Across tracked products',
      subtextColor: 'text-slate-400 dark:text-slate-500',
      icon: Star,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="rounded-2xl border-slate-200/80 p-4 shadow-xs transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {stat.label}
                  </span>
                  <span className={`block text-[11px] font-medium ${stat.subtextColor}`}>
                    {stat.subtext}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
