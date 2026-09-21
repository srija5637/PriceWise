'use client';

import DashboardPage from '@/app/page';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
