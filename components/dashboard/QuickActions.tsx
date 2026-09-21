'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Scale, Bookmark, Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function QuickActions() {
  const actions = [
    {
      label: 'Ask AI Shopping Assistant',
      href: '/ai-assistant',
      icon: Bot,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      label: 'Compare Products',
      href: '/compare',
      icon: Scale,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
    {
      label: 'View Watchlist',
      href: '/watchlist',
      icon: Bookmark,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    },
    {
      label: 'Manage Price Alerts',
      href: '/alerts',
      icon: Bell,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400',
    },
  ];

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition hover:border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${act.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {act.label}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
