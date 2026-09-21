'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState } from '@/types';
import { Button } from '@/components/ui/button';

export function SearchFilters({
  filters,
  onChange,
  availableBrands,
  availableStores,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableBrands: string[];
  availableStores: string[];
}) {
  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const toggleStore = (store: string) => {
    const next = filters.stores.includes(store)
      ? filters.stores.filter((s) => s !== store)
      : [...filters.stores, store];
    onChange({ ...filters, stores: next });
  };

  const handleReset = () => {
    onChange({
      priceMin: undefined,
      priceMax: undefined,
      brands: [],
      stores: [],
      minRating: undefined,
      minDiscount: undefined,
      inStockOnly: false,
      fastDeliveryOnly: false,
      sortBy: 'lowest_price',
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5 text-xs">
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <span>Filter Results</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMin: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-xs dark:border-slate-800 dark:bg-slate-950"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMax: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-xs dark:border-slate-800 dark:bg-slate-950"
          />
        </div>
      </div>

      {/* Stores */}
      {availableStores.length > 0 && (
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
            Stores
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {availableStores.map((store) => (
              <label key={store} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.stores.includes(store)}
                  onChange={() => toggleStore(store)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{store}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
            Brands
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Minimum Rating */}
      <div>
        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
          Customer Rating
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[4.5, 4.0, 3.5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant={filters.minRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                onChange({
                  ...filters,
                  minRating: filters.minRating === rating ? undefined : rating,
                })
              }
              className="h-8 text-[11px] justify-center"
            >
              {rating}★ & above
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.fastDeliveryOnly}
            onChange={(e) => onChange({ ...filters, fastDeliveryOnly: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">Fast Delivery (1-2 Days)</span>
        </label>
      </div>
    </div>
  );
}
