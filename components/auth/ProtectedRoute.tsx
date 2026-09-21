'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname || '/')}`;
      router.replace(redirectUrl);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
          <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        </div>
        <div className="h-4 w-44 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse mb-2" />
        <p className="text-xs text-slate-400 dark:text-slate-500">Verifying secure session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
