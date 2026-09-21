import { Product, PriceHistoryPoint } from '@/types';

export interface PriceAnalysisReport {
  productId: string;
  currentPrice: number;
  historicalMin: number;
  historicalMax: number;
  averagePrice: number;
  volatilityPercentage: number;
  thirtyDayChangePercent: number;
  isHistoricalLow: boolean;
  isAnomalyDrop: boolean;
  insightSummary: string;
  buyingAdvice: 'buy_now' | 'wait_for_drop' | 'fair_price';
}

export function analyzeProductPrice(product: Product): PriceAnalysisReport {
  const current = product.lowestPrice || 0;
  const history: PriceHistoryPoint[] = product.priceHistory || [];
  const prices = history.map((h) => h.price);

  if (prices.length === 0) {
    return {
      productId: product.id,
      currentPrice: current,
      historicalMin: current,
      historicalMax: current,
      averagePrice: current,
      volatilityPercentage: 0,
      thirtyDayChangePercent: 0,
      isHistoricalLow: true,
      isAnomalyDrop: false,
      insightSummary: 'Single observation recorded. No price fluctuation history available yet.',
      buyingAdvice: 'fair_price',
    };
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const sum = prices.reduce((acc, val) => acc + val, 0);
  const avg = Math.round(sum / prices.length);

  // Volatility = standard deviation relative to mean
  const variance =
    prices.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const volatility = Math.round((stdDev / (avg || 1)) * 100);

  // 30-day change estimation
  const oldestInWindow = prices[0] || current;
  const thirtyDayChange = Math.round(((current - oldestInWindow) / oldestInWindow) * 100);

  const isHistoricalLow = current <= min;
  const diffFromAvg = Math.round(((current - avg) / avg) * 100);
  const isAnomalyDrop = diffFromAvg <= -12;

  let buyingAdvice: 'buy_now' | 'wait_for_drop' | 'fair_price' = 'fair_price';
  let insightSummary = '';

  if (isHistoricalLow) {
    buyingAdvice = 'buy_now';
    insightSummary = `This product is at its lowest recorded price in our database (₹${min.toLocaleString('en-IN')}). Strong value opportunity.`;
  } else if (diffFromAvg <= -5) {
    buyingAdvice = 'buy_now';
    insightSummary = `Current price is ${Math.abs(diffFromAvg)}% below the 30-day average of ₹${avg.toLocaleString('en-IN')}. Good time to buy.`;
  } else if (diffFromAvg >= 8) {
    buyingAdvice = 'wait_for_drop';
    insightSummary = `Current price is currently ${diffFromAvg}% above average. Setting a price drop alert is recommended.`;
  } else {
    buyingAdvice = 'fair_price';
    insightSummary = `Current price is close to the typical market average of ₹${avg.toLocaleString('en-IN')}.`;
  }

  return {
    productId: product.id,
    currentPrice: current,
    historicalMin: min,
    historicalMax: max,
    averagePrice: avg,
    volatilityPercentage: volatility,
    thirtyDayChangePercent: thirtyDayChange,
    isHistoricalLow,
    isAnomalyDrop,
    insightSummary,
    buyingAdvice,
  };
}
