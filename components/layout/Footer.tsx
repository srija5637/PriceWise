import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">PriceWise</span>
          <span className="text-slate-400">Shop Smarter. Save More.</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 font-medium">
          <Link href="/help" className="hover:text-blue-600 transition">About</Link>
          <Link href="/help" className="hover:text-blue-600 transition">Blog</Link>
          <Link href="/settings" className="hover:text-blue-600 transition">Privacy</Link>
          <Link href="/help" className="hover:text-blue-600 transition">Terms</Link>
          <Link href="/help" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Socials & Note */}
        <div className="flex items-center gap-4">
          <span className="text-[11px]">
            Made with <span className="text-rose-500">❤️</span> for smarter shoppers
          </span>
        </div>
      </div>
    </footer>
  );
}
