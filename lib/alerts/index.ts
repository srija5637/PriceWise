import { PriceAlert, WatchlistItem } from '@/types';
import { getEnrichedProducts, STORES } from '@/lib/db/seed-data';

// Initial grounded state for the demo user
export const INITIAL_TRACKED_PRODUCTS: WatchlistItem[] = [
  {
    id: 'wl-ip16',
    userId: 'demo-user',
    productVariantId: 'var-iphone-16-128gb-black',
    variant: getEnrichedProducts()[0].variants[0],
    product: getEnrichedProducts()[0],
    targetPrice: 65000,
    currentPrice: 68499,
    lowestPrice: 67999,
    priceChangePercent: -6,
    bestStore: STORES.flipkart,
    createdAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'wl-mba-m3',
    userId: 'demo-user',
    productVariantId: 'var-macbook-air-m3-midnight',
    variant: getEnrichedProducts()[1].variants[0],
    product: getEnrichedProducts()[1],
    targetPrice: 95000,
    currentPrice: 99990,
    lowestPrice: 97990,
    priceChangePercent: -4,
    bestStore: STORES.amazon,
    createdAt: '2026-09-12T14:30:00Z',
  },
  {
    id: 'wl-xm5',
    userId: 'demo-user',
    productVariantId: 'var-sony-xm5-black',
    variant: getEnrichedProducts()[2].variants[0],
    product: getEnrichedProducts()[2],
    targetPrice: 28000,
    currentPrice: 29990,
    lowestPrice: 28999,
    priceChangePercent: -8,
    bestStore: STORES.croma,
    createdAt: '2026-09-15T09:15:00Z',
  },
  {
    id: 'wl-tv-55',
    userId: 'demo-user',
    productVariantId: 'var-samsung-55-qled',
    variant: getEnrichedProducts()[3].variants[0],
    product: getEnrichedProducts()[3],
    targetPrice: 50000,
    currentPrice: 54990,
    lowestPrice: 52499,
    priceChangePercent: -5,
    bestStore: STORES.reliance,
    createdAt: '2026-09-16T18:00:00Z',
  },
];

export const INITIAL_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    userId: 'demo-user',
    productVariantId: 'var-iphone-16-128gb-black',
    variant: getEnrichedProducts()[0].variants[0],
    product: getEnrichedProducts()[0],
    targetPrice: 65000,
    currentPrice: 68499,
    currency: 'INR',
    enabled: true,
    createdAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'alert-2',
    userId: 'demo-user',
    productVariantId: 'var-sony-xm5-black',
    variant: getEnrichedProducts()[2].variants[0],
    product: getEnrichedProducts()[2],
    targetPrice: 28500,
    currentPrice: 29990,
    currency: 'INR',
    enabled: true,
    createdAt: '2026-09-15T09:15:00Z',
  },
  {
    id: 'alert-3',
    userId: 'demo-user',
    productVariantId: 'var-macbook-air-m3-midnight',
    variant: getEnrichedProducts()[1].variants[0],
    product: getEnrichedProducts()[1],
    targetPrice: 96000,
    currentPrice: 99990,
    currency: 'INR',
    enabled: true,
    createdAt: '2026-09-12T14:30:00Z',
  },
  {
    id: 'alert-4',
    userId: 'demo-user',
    productVariantId: 'var-samsung-55-qled',
    variant: getEnrichedProducts()[3].variants[0],
    product: getEnrichedProducts()[3],
    targetPrice: 51000,
    currentPrice: 54990,
    currency: 'INR',
    enabled: true,
    createdAt: '2026-09-16T18:00:00Z',
  },
  {
    id: 'alert-5',
    userId: 'demo-user',
    productVariantId: 'var-oneplus-12-silky-black',
    variant: getEnrichedProducts()[4].variants[0],
    product: getEnrichedProducts()[4],
    targetPrice: 60000,
    currentPrice: 61499,
    currency: 'INR',
    enabled: true,
    createdAt: '2026-09-18T10:00:00Z',
  },
];

export function evaluatePriceAlerts(alerts: PriceAlert[]): { checkedCount: number; triggeredAlerts: PriceAlert[] } {
  const triggered: PriceAlert[] = [];

  for (const alert of alerts) {
    if (!alert.enabled) continue;
    if (alert.currentPrice <= alert.targetPrice) {
      triggered.push({
        ...alert,
        triggeredAt: new Date().toISOString(),
      });
    }
  }

  return {
    checkedCount: alerts.length,
    triggeredAlerts: triggered,
  };
}
