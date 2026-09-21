import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const metadata: Metadata = {
  title: 'PriceWise — Shop Smarter. Save More.',
  description:
    'AI-powered multi-store price comparison, real-time price tracking, review analysis, and shopping intelligence platform.',
  keywords: [
    'Price comparison',
    'Price tracker',
    'Amazon price history',
    'Flipkart discounts',
    'Shopping assistant',
    'Value score',
  ],
  openGraph: {
    title: 'PriceWise — Shop Smarter. Save More.',
    description:
      'Compare prices across multiple stores, track product prices, and make smarter buying decisions with PriceWise.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
