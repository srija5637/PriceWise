'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  LayoutDashboard,
  Search,
  Scale,
  Bookmark,
  Bell,
  LineChart,
  Tag,
  TrendingUp,
  Grid,
  Bot,
  ListChecks,
  Store,
  Settings,
  HelpCircle,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const MAIN_NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Compare', href: '/compare', icon: Scale },
  { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
  { name: 'Shopping Lists', href: '/shopping-lists', icon: ListChecks },
  { name: 'Price Alerts', href: '/alerts', icon: Bell, badge: 5 },
  { name: 'Price History', href: '/history', icon: LineChart },
  { name: 'Deals & Offers', href: '/deals', icon: Tag },
  { name: 'Trending', href: '/trending', icon: TrendingUp },
  { name: 'Categories', href: '/categories', icon: Grid },
  { name: 'Store Intelligence', href: '/stores', icon: Store },
  { name: 'AI Shopping Assistant', href: '/ai-assistant', icon: Bot },
];

export const SECONDARY_NAV_ITEMS = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

export function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div>
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-2 py-3 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Price<span className="text-blue-600">Wise</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400">Shop Smarter. Save More.</p>
          </div>
        </Link>

        {/* Primary Navigation */}
        <nav className="mt-6 space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <Badge className="h-5 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white hover:bg-rose-600">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

        {/* Secondary Navigation */}
        <nav className="space-y-1">
          {SECONDARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                )}
              >
                <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Promo Card */}
      <div className="mt-4 rounded-2xl border border-amber-200/50 bg-gradient-to-b from-amber-50/60 to-orange-50/30 p-3.5 shadow-sm dark:border-amber-900/40 dark:from-amber-950/20 dark:to-orange-950/10">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Crown className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Upgrade to Pro</span>
        </div>
        <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Price drop alerts</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Extended price history</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Exclusive deals & coupons</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>AI recommendations</span>
          </li>
        </ul>
        <Button
          size="sm"
          className="mt-3 w-full rounded-xl bg-slate-900 font-semibold text-xs text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          Upgrade Now
        </Button>
      </div>
    </aside>
  );
}
