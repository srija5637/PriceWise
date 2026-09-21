'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Camera, Mic, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultimodalSearchModal } from '@/components/search/MultimodalSearchModal';

const POPULAR_SEARCHES = [
  'iPhone 16',
  'MacBook Air',
  'Sony WH-1000XM5',
  'Samsung TV',
  'Nike shoes',
  'Air Fryer',
  'Smart Watch',
];

export function HeroBanner() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState('');
  const [isMultimodalOpen, setIsMultimodalOpen] = useState(false);
  const [multimodalTab, setMultimodalTab] = useState<'image' | 'url' | 'barcode' | 'voice'>('image');

  const openMultimodal = (tab: 'image' | 'url' | 'barcode' | 'voice') => {
    setMultimodalTab(tab);
    setIsMultimodalOpen(true);
  };
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-100/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/40 p-6 md:p-8 dark:border-blue-950/40 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <span>WELCOME TO PRICEWISE</span>
          </div>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Find the best price.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Always.
            </span>
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Compare prices across multiple websites, track products, discover deals and make smarter buying decisions.
          </p>

          {/* Large Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!heroQuery.trim()) return;
              router.push(`/search?q=${encodeURIComponent(heroQuery.trim())}`);
            }}
            className="mt-5 relative flex items-center max-w-xl"
          >
            <Search className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for a product... (e.g. iPhone 16, MacBook Air)"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200/90 bg-white/95 pl-11 pr-48 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900"
            />
            {/* Multimodal Quick Triggers */}
            <div className="absolute right-24 flex items-center gap-1">
              <button
                type="button"
                onClick={() => openMultimodal('image')}
                title="Search with Image or Screenshot"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openMultimodal('url')}
                title="Paste Competitor URL to Compare"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <LinkIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => openMultimodal('voice')}
                title="Voice Search"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="submit"
              className="absolute right-1.5 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 text-xs font-semibold text-white shadow-xs cursor-pointer"
            >
              Search
            </Button>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-slate-200/90 bg-white/80 px-3.5 py-1 text-xs font-medium text-slate-700 shadow-2xs backdrop-blur-xs transition hover:border-blue-400 hover:bg-blue-50/80 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Graphical Illustration */}
        <div className="relative hidden lg:flex items-center justify-center pr-6">
          <div className="relative flex flex-col items-center">
            {/* Tagline Graphic */}
            <div className="mb-2 text-right">
              <span className="text-xs font-serif italic text-blue-600/80 dark:text-blue-400">
                Same Product • Different Prices • Smarter Choices
              </span>
            </div>

            {/* Shopping bags composition */}
            <div className="relative flex items-center justify-center">
              {/* Bag 1 */}
              <div className="relative z-10 flex h-24 w-20 flex-col items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl text-white">
                <div className="h-6 w-10 border-2 border-white/60 border-b-0 rounded-t-full -mt-6 mb-2" />
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>

              {/* Bag 2 */}
              <div className="relative -ml-6 mt-4 z-20 flex h-28 w-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 shadow-2xl text-white">
                <div className="h-7 w-12 border-2 border-white/70 border-b-0 rounded-t-full -mt-7 mb-2" />
                <span className="text-xs font-black tracking-wider uppercase">SAVE</span>
              </div>

              {/* Floating Retailer Badges */}
              <div className="absolute -top-3 -right-6 flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-md text-amber-500 font-black text-xs border border-slate-100 dark:bg-slate-800">
                a
              </div>
              <div className="absolute top-8 -right-12 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 shadow-md text-blue-800 font-black text-xs">
                f
              </div>
              <div className="absolute -bottom-2 -right-8 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 shadow-md text-white font-bold text-xs">
                C
              </div>
              <div className="absolute -bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 shadow-md text-white font-bold text-[10px]">
                VR
              </div>
              <div className="absolute top-12 right-12 flex h-6 px-1.5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 shadow-xs border border-slate-200">
                + more
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multimodal AI Search Modal */}
      <MultimodalSearchModal
        isOpen={isMultimodalOpen}
        onClose={() => setIsMultimodalOpen(false)}
        defaultTab={multimodalTab}
      />
    </div>
  );
}
