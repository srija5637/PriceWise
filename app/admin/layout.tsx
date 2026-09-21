'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Store,
  Radio,
  Cpu,
  BarChart3,
  Users,
  Activity,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & Variants', href: '/admin/products', icon: Package },
  { label: 'Store Offers', href: '/admin/offers', icon: Store },
  { label: 'Data Providers', href: '/admin/providers', icon: Radio },
  { label: 'Background Jobs', href: '/admin/jobs', icon: Activity },
  { label: 'AI Observability', href: '/admin/ai', icon: Cpu },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'User Directory', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md">
              <ShieldAlert className="h-5 w-5 text-indigo-400 dark:text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  PriceWise Admin & Observability
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Systems Operational</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Large-scale catalog monitoring, provider circuit breakers, AI grounding, and ETL health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content View */}
        <div className="pt-2">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
