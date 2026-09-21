'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  Zap,
  ArrowRight,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface PriceWiseNotification {
  id: string;
  category: 'price_drop' | 'target_reached' | 'back_in_stock' | 'deal' | 'historical_low';
  title: string;
  message: string;
  productName: string;
  productId: string;
  oldPrice?: number;
  newPrice?: number;
  store: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: PriceWiseNotification[] = [
  {
    id: 'notif-1',
    category: 'historical_low',
    title: 'New All-Time Historical Low!',
    message: 'Samsung 55" QLED TV has reached a new recorded low of ₹52,499 on Reliance Digital.',
    productName: 'Samsung 55" QLED TV',
    productId: 'prod-4',
    oldPrice: 54990,
    newPrice: 52499,
    store: 'Reliance Digital',
    timestamp: '25m ago',
    read: false,
  },
  {
    id: 'notif-2',
    category: 'target_reached',
    title: 'Target Price Reached',
    message: 'iPhone 16 128GB dropped below your target of ₹69,000 on Flipkart.',
    productName: 'iPhone 16 128GB',
    productId: 'prod-1',
    oldPrice: 79900,
    newPrice: 68499,
    store: 'Flipkart',
    timestamp: '2h ago',
    read: false,
  },
  {
    id: 'notif-3',
    category: 'price_drop',
    title: 'Price Drop Alert',
    message: 'Sony WH-1000XM5 headphones dropped ₹1,000 on Croma.',
    productName: 'Sony WH-1000XM5',
    productId: 'prod-3',
    oldPrice: 29990,
    newPrice: 28999,
    store: 'Croma',
    timestamp: '5h ago',
    read: false,
  },
  {
    id: 'notif-4',
    category: 'back_in_stock',
    title: 'Back in Stock',
    message: 'MacBook Air M3 16GB RAM variant is back in stock on Amazon.',
    productName: 'MacBook Air M3',
    productId: 'prod-2',
    store: 'Amazon',
    timestamp: '1d ago',
    read: true,
  },
  {
    id: 'notif-5',
    category: 'deal',
    title: 'Verified 28% Festival Deal',
    message: 'OnePlus 12 received a verified instant bank discount coupon.',
    productName: 'OnePlus 12',
    productId: 'prod-5',
    store: 'Amazon',
    timestamp: '1d ago',
    read: true,
  },
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<PriceWiseNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.category === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Smart Alerts & Deals
            </h4>
            <span className="text-[10px] text-slate-400">
              {unreadCount} unread price intelligence updates
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              title="Mark all as read"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={clearAll}
            title="Clear notifications"
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar text-[11px] font-medium border-b border-slate-100 dark:border-slate-800">
        {['all', 'unread', 'price_drop', 'target_reached', 'deal'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap capitalize transition cursor-pointer ${
              activeFilter === tab
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 py-1">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-2.5 transition rounded-xl ${
                notif.read
                  ? 'opacity-80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {notif.category === 'historical_low' && (
                    <div className="h-6 w-6 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {notif.category === 'target_reached' && (
                    <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {notif.category === 'price_drop' && (
                    <div className="h-6 w-6 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center">
                      <TrendingDown className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {notif.category === 'back_in_stock' && (
                    <div className="h-6 w-6 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                      <PackageCheck className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {notif.category === 'deal' && (
                    <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Store: {notif.store}
                    </span>
                    <Link
                      href={`/product/${notif.productId}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Deal <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <Link
          href="/alerts"
          onClick={onClose}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Manage All Price Alerts →
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Preferences
        </Link>
      </div>
    </div>
  );
}
