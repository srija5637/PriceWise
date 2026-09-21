'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ListChecks,
  Plus,
  Trash2,
  TrendingDown,
  Sparkles,
  Calculator,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateShoppingBudgetPlan, BudgetPlanResult } from '@/lib/ai/agents/budgetPlanner';
import { formatCurrency } from '@/lib/utils';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product } from '@/types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface ShoppingListItem {
  id: string;
  product: Product;
  targetPrice?: number;
  addedAt: string;
}

interface ShoppingList {
  id: string;
  name: string;
  description: string;
  items: ShoppingListItem[];
  totalBudget?: number;
}

export default function ShoppingListsPage() {
  const allProducts = getEnrichedProducts();

  // Initial Sample Lists
  const [lists, setLists] = useState<ShoppingList[]>([
    {
      id: 'list-1',
      name: 'Work from Home Tech Setup',
      description: 'Monitoring hardware upgrades for productivity and coding',
      totalBudget: 150000,
      items: [
        {
          id: 'item-1',
          product: allProducts[1], // MacBook Air
          targetPrice: 95000,
          addedAt: '2 days ago',
        },
        {
          id: 'item-2',
          product: allProducts[2], // Sony XM5
          targetPrice: 27000,
          addedAt: 'Yesterday',
        },
      ],
    },
    {
      id: 'list-2',
      name: 'Family Living Room Entertainment',
      description: 'Display and audio gear for the festival season',
      totalBudget: 60000,
      items: [
        {
          id: 'item-3',
          product: allProducts[3], // Samsung TV
          targetPrice: 50000,
          addedAt: '3 days ago',
        },
      ],
    },
  ]);

  const [activeListId, setActiveListId] = useState<string>('list-1');
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Budget Planner State
  const [budgetInput, setBudgetInput] = useState<number>(100000);
  const [budgetCategories, setBudgetCategories] = useState<string>('laptops, headphones, tvs');
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlanResult | null>(null);

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList: ShoppingList = {
      id: 'list-' + Date.now(),
      name: newListName.trim(),
      description: 'Custom curated shopping list',
      items: [],
    };

    setLists([...lists, newList]);
    setActiveListId(newList.id);
    setNewListName('');
    setIsCreatingList(false);
  };

  const handleRunBudgetPlanner = (e: React.FormEvent) => {
    e.preventDefault();
    const categoriesArray = budgetCategories.split(',').map((c) => c.trim()).filter(Boolean);
    const plan = generateShoppingBudgetPlan(budgetInput, categoriesArray);
    setBudgetPlan(plan);
  };

  const currentListTotal = (activeList?.items || []).reduce(
    (sum, item) => sum + (item.product.lowestPrice || 0),
    0
  );

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              <ListChecks className="h-3.5 w-3.5" />
              <span>Smart Shopping Planner</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Shopping Lists & AI Budget Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize bundles, track cumulative price changes, and let AI optimize your product combinations within budget.
          </p>
        </div>

        <Button
          onClick={() => setIsCreatingList(true)}
          className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Shopping List</span>
        </Button>
      </div>

      {/* New List Modal / Inline Form */}
      {isCreatingList && (
        <form
          onSubmit={handleCreateList}
          className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900"
        >
          <input
            type="text"
            placeholder="List name (e.g. Diwali Shopping, New Gaming Setup)..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1 min-w-[240px] h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <Button type="submit" className="h-10 px-4 bg-blue-600 text-white text-xs font-bold">
            Create List
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsCreatingList(false)}
            className="h-10 px-3 text-xs"
          >
            Cancel
          </Button>
        </form>
      )}

      {/* Main Grid: Lists View & AI Budget Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Shopping List */}
        <div className="lg:col-span-2 space-y-6">
          {/* List Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {lists.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setActiveListId(l.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeListId === l.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{l.name}</span>
                <span className="rounded-full bg-black/20 dark:bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {l.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* Active List Card */}
          {activeList && (
            <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {activeList.name}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">{activeList.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Combined Lowest Total
                  </span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {formatCurrency(currentListTotal)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {activeList.items.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    This shopping list is currently empty. Browse products and click &ldquo;Add to List&rdquo;.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeList.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                              {item.product.brand}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Best store: <strong className="text-slate-700 dark:text-slate-300">{item.product.bestOffer?.store.name}</strong> • Added {item.addedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <div className="text-left sm:text-right">
                            <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                              {formatCurrency(item.product.lowestPrice || 0)}
                            </span>
                            {item.targetPrice && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Target: {formatCurrency(item.targetPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/product/${item.product.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg text-xs font-semibold"
                              >
                                View
                              </Button>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setLists((prev) =>
                                  prev.map((l) =>
                                    l.id === activeList.id
                                      ? { ...l, items: l.items.filter((i) => i.id !== item.id) }
                                      : l
                                  )
                                );
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Col: AI Budget Planner Widget */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 p-6 dark:border-indigo-950/50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Calculator className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Budget Planner</span>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-slate-100">
              Optimal Bundle Allocation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your maximum budget and target product categories. PriceWise AI will find the highest value combination without exceeding your limit.
            </p>

            <form onSubmit={handleRunBudgetPlanner} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Total Budget (₹)
                </label>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Desired Categories (comma separated)
                </label>
                <input
                  type="text"
                  value={budgetCategories}
                  onChange={(e) => setBudgetCategories(e.target.value)}
                  placeholder="laptops, headphones, tvs..."
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Calculate Best Bundle
              </Button>
            </form>

            {/* Plan Result */}
            {budgetPlan && (
              <div className="mt-5 pt-4 border-t border-indigo-100 dark:border-indigo-900/50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Total Spent:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-extrabold">
                    {formatCurrency(budgetPlan.totalSpent)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Remaining Savings:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {formatCurrency(budgetPlan.totalSaved)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {budgetPlan.recommendationSummary}
                </div>

                {/* Items breakdown */}
                <div className="space-y-2 pt-1">
                  {budgetPlan.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          {item.category}
                        </span>
                        <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                          {item.product.name}
                        </h5>
                      </div>
                      <span className="font-black text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
