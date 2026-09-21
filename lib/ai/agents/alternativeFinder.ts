import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product } from '@/types';

export interface AlternativeRecommendation {
  type: 'cheaper' | 'better_rated' | 'best_value';
  title: string;
  product: Product;
  priceDifference: number;
  ratingDifference: number;
  tradeoffExplanation: string;
}

export function findAlternativesForProduct(targetProduct: Product): AlternativeRecommendation[] {
  const all = getEnrichedProducts();
  const peers = all.filter(
    (p) => p.id !== targetProduct.id && (p.categoryId === targetProduct.categoryId || p.category?.slug === targetProduct.category?.slug)
  );

  const recommendations: AlternativeRecommendation[] = [];

  // 1. Cheaper Alternative
  const cheaper = peers
    .filter((p) => (p.lowestPrice || 0) < (targetProduct.lowestPrice || Infinity))
    .sort((a, b) => (a.lowestPrice || 0) - (b.lowestPrice || 0))[0];

  if (cheaper) {
    const savings = (targetProduct.lowestPrice || 0) - (cheaper.lowestPrice || 0);
    recommendations.push({
      type: 'cheaper',
      title: 'Cheaper Alternative',
      product: cheaper,
      priceDifference: -savings,
      ratingDifference: parseFloat(((cheaper.rating || 0) - (targetProduct.rating || 0)).toFixed(1)),
      tradeoffExplanation: `Saves ₹${savings.toLocaleString('en-IN')} while maintaining strong customer rating of ${cheaper.rating || 4.5}★.`,
    });
  }

  // 2. Better Rated Alternative
  const betterRated = peers
    .filter((p) => (p.rating || 0) > (targetProduct.rating || 0))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  if (betterRated) {
    const priceDiff = (betterRated.lowestPrice || 0) - (targetProduct.lowestPrice || 0);
    recommendations.push({
      type: 'better_rated',
      title: 'Higher-Rated Alternative',
      product: betterRated,
      priceDifference: priceDiff,
      ratingDifference: parseFloat(((betterRated.rating || 0) - (targetProduct.rating || 0)).toFixed(1)),
      tradeoffExplanation: `Rated ${betterRated.rating}★ across ${betterRated.reviewCount?.toLocaleString()} reviews.`,
    });
  }

  // 3. Best Value Alternative
  const bestValue = peers.sort(
    (a, b) => (b.bestOffer?.valueScore || 0) - (a.bestOffer?.valueScore || 0)
  )[0];

  if (bestValue && bestValue.id !== cheaper?.id && bestValue.id !== betterRated?.id) {
    const priceDiff = (bestValue.lowestPrice || 0) - (targetProduct.lowestPrice || 0);
    recommendations.push({
      type: 'best_value',
      title: 'Top Value Score Alternative',
      product: bestValue,
      priceDifference: priceDiff,
      ratingDifference: parseFloat(((bestValue.rating || 0) - (targetProduct.rating || 0)).toFixed(1)),
      tradeoffExplanation: `Highest composite PriceWise Value Score (${bestValue.bestOffer?.valueScore || 92}/100) in this category.`,
    });
  }

  return recommendations;
}
