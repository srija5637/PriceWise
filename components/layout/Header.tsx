'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Moon, Sun, Bell, Menu, ChevronDown, LogOut, User as UserIcon, Settings, X, Camera, Mic, Sparkles, Shield, Lock } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/db/seed-data';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MultimodalSearchModal } from '@/components/search/MultimodalSearchModal';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useAuth } from '@/lib/auth/AuthContext';

function HeaderSearchBar({
  selectedCategory,
  onSearch,
  onOpenMultimodal,
}: {
  selectedCategory: string;
  onSearch?: () => void;
  onOpenMultimodal?: (tab: 'image' | 'url' | 'barcode' | 'voice') => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const catParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}${catParam}`);
    onSearch?.();
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search for a product, brand or category... (e.g. iPhone 16, MacBook)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100/90 pl-10 pr-28 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
        />

        {/* Multimodal Search Triggers inside input */}
        <div className="absolute right-9 flex items-center gap-1">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenMultimodal?.('image')}
                title="Search with Image / Screenshot"
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onOpenMultimodal?.('voice')}
                title="Voice Search"
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer mr-0.5"
              >
                <Mic className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        <button
          type="submit"
          className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 cursor-pointer shadow-2xs"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="sr-only">Search</span>
        </button>
      </div>
    </form>
  );
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMultimodalOpen, setIsMultimodalOpen] = useState(false);
  const [multimodalTab, setMultimodalTab] = useState<'image' | 'url' | 'barcode' | 'voice'>('image');
  const [isDark, setIsDark] = useState(false);

  const openMultimodal = (tab: 'image' | 'url' | 'barcode' | 'voice') => {
    setMultimodalTab(tab);
    setIsMultimodalOpen(true);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 dark:text-slate-300"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Global Desktop Search Bar */}
        <div className="hidden w-80 md:block lg:w-96 xl:w-[480px]">
          <Suspense fallback={<div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
            <HeaderSearchBar
              selectedCategory={selectedCategory}
              onOpenMultimodal={openMultimodal}
            />
          </Suspense>
        </div>
      </div>

      {/* Right Actions: Category selector, Dark mode, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Category Dropdown */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <span>
              {selectedCategory === 'all'
                ? 'All Categories'
                : CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Category'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isCategoryOpen && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setIsCategoryOpen(false);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="md:hidden rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isMobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          <span className="sr-only">Toggle Mobile Search</span>
        </Button>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle Theme</span>
        </Button>

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Notification Center Dropdown */}
          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* User Account / Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Avatar name="User" className="h-8 w-8 text-xs font-bold" />
            <span className="hidden text-xs font-semibold text-slate-800 dark:text-slate-200 sm:inline">User</span>
            <ChevronDown className="hidden h-3 w-3 text-slate-400 sm:inline" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">User</p>
                <p className="text-[10px] text-slate-400">
                  {user?.phone ? `${user.phone} · Verified` : user?.email || 'Authenticated Account'}
                </p>
              </div>
              <Link
                href="/settings?tab=account"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings?tab=preferences"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Settings</span>
              </Link>
              <Link
                href="/settings?tab=notifications"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Bell className="h-3.5 w-3.5 text-slate-400" />
                <span>Notifications</span>
              </Link>
              <Link
                href="/settings?tab=security"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>Security</span>
              </Link>
              <Link
                href="/settings?tab=privacy"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <span>Privacy</span>
              </Link>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={async () => {
                  setIsUserMenuOpen(false);
                  await signOut();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar Expandable Drawer */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 border-b border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:hidden animate-in slide-in-from-top-2 duration-150">
          <Suspense fallback={<div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
            <HeaderSearchBar
              selectedCategory={selectedCategory}
              onSearch={() => setIsMobileSearchOpen(false)}
            />
          </Suspense>
        </div>
      )}

      {/* Multimodal AI Search Modal */}
      <MultimodalSearchModal
        isOpen={isMultimodalOpen}
        onClose={() => setIsMultimodalOpen(false)}
        defaultTab={multimodalTab}
      />
    </header>
  );
}
