import { Offer, ValueScoreBreakdown } from '@/types';

export interface ScoringWeights {
  priceWeight: number;      // default: 0.40
  ratingWeight: number;     // default: 0.25
  reviewWeight: number;     // default: 0.15
  sellerWeight: number;     // default: 0.10
  deliveryWeight: number;   // default: 0.10
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  priceWeight: 0.40,
  ratingWeight: 0.25,
  reviewWeight: 0.15,
  sellerWeight: 0.10,
  deliveryWeight: 0.10,
};

/**
 * Calculate the Price Score (0 - 100)
 * Evaluates how competitive the offer price is compared to the lowest offer in the market
 * and the discount off original MRP.
 */
export function calculatePriceScore(price: number, lowestPrice: number, originalPrice?: number): number {
  if (price <= 0) return 0;
  
  // Benchmark relative to lowest available price
  const priceSpread = Math.max(0, (price - lowestPrice) / lowestPrice);
  let baseScore = Math.max(20, 100 - (priceSpread * 150));

  // Bonus for substantial verified discount off original price
  if (originalPrice && originalPrice > price) {
    const discountPct = ((originalPrice - price) / originalPrice) * 100;
    const discountBonus = Math.min(15, discountPct * 0.3);
    baseScore = Math.min(100, baseScore + discountBonus);
  }

  return Math.round(Math.min(100, Math.max(10, baseScore)));
}

/**
 * Calculate the Rating Score (0 - 100)
 * Scaled directly from 0 - 5.0 verified consumer ratings.
 */
export function calculateRatingScore(rating?: number): number {
  if (!rating || rating <= 0) return 60; // neutral fallback when unavailable
  const clamped = Math.min(5, Math.max(1, rating));
  return Math.round((clamped / 5) * 100);
}

/**
 * Calculate Review Confidence (0 - 100)
 * Uses a logarithmic curve to ensure statistical validity without penalizing
 * moderately popular items unduly, while preventing 1-review 5-star bias.
 */
export function calculateReviewConfidence(reviewCount?: number): number {
  if (!reviewCount || reviewCount <= 0) return 30;
  if (reviewCount < 10) return 40;
  if (reviewCount < 50) return 55;
  if (reviewCount < 200) return 70;
  if (reviewCount < 1000) return 82;
  if (reviewCount < 5000) return 90;
  if (reviewCount < 20000) return 95;
  return 100;
}

/**
 * Calculate Seller Score (0 - 100)
 * Assesses store verification, seller name, and merchant reliability.
 */
export function calculateSellerScore(sellerName?: string, storeVerified?: boolean): number {
  let score = storeVerified ? 90 : 75;
  if (sellerName) {
    const lower = sellerName.toLowerCase();
    if (lower.includes('official') || lower.includes('authorized') || lower.includes('retail') || lower.includes('apple') || lower.includes('samsung')) {
      score += 6;
    }
  }
  return Math.min(100, Math.max(50, score));
}

/**
 * Calculate Delivery Score (0 - 100)
 * Based on available fulfillment speed and delivery estimates.
 */
export function calculateDeliveryScore(deliveryInfo?: string): number {
  if (!deliveryInfo) return 70;
  const lower = deliveryInfo.toLowerCase();
  if (lower.includes('today') || lower.includes('same day')) return 98;
  if (lower.includes('tomorrow') || lower.includes('1 day') || lower.includes('next day')) return 94;
  if (lower.includes('2 day') || lower.includes('2 days')) return 88;
  if (lower.includes('3 day') || lower.includes('3 days')) return 82;
  if (lower.includes('standard') || lower.includes('4-5') || lower.includes('5-7')) return 72;
  return 75;
}

/**
 * Central PriceWise Transparent Value Scoring Engine
 * Computes individual score dimensions and synthesizes the Overall Value Score.
 */
export function calculateValueScore(
  offer: Pick<Offer, 'price' | 'originalPrice' | 'rating' | 'reviewCount' | 'sellerName' | 'deliveryInfo'>,
  lowestPriceInGroup: number,
  storeVerified = true,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): ValueScoreBreakdown {
  const priceScore = calculatePriceScore(offer.price, lowestPriceInGroup, offer.originalPrice);
  const ratingScore = calculateRatingScore(offer.rating);
  const reviewConfidence = calculateReviewConfidence(offer.reviewCount);
  const sellerScore = calculateSellerScore(offer.sellerName, storeVerified);
  const deliveryScore = calculateDeliveryScore(offer.deliveryInfo);

  const overall = Math.round(
    priceScore * weights.priceWeight +
    ratingScore * weights.ratingWeight +
    reviewConfidence * weights.reviewWeight +
    sellerScore * weights.sellerWeight +
    deliveryScore * weights.deliveryWeight
  );

  return {
    priceScore,
    ratingScore,
    reviewConfidence,
    sellerScore,
    deliveryScore,
    overallValueScore: Math.min(100, Math.max(1, overall)),
  };
}
