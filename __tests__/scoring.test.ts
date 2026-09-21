import {
  calculatePriceScore,
  calculateRatingScore,
  calculateReviewConfidence,
  calculateValueScore,
  DEFAULT_SCORING_WEIGHTS,
} from '../lib/scoring';

describe('PriceWise Value Scoring Engine', () => {
  test('calculatePriceScore awards high score for market lowest price', () => {
    const score = calculatePriceScore(68499, 68499, 79900);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  test('calculatePriceScore reduces score when price is higher than market lowest', () => {
    const lowest = 68499;
    const higher = 74999;
    const scoreLowest = calculatePriceScore(lowest, lowest);
    const scoreHigher = calculatePriceScore(higher, lowest);
    expect(scoreHigher).toBeLessThan(scoreLowest);
  });

  test('calculateRatingScore maps 0-5 stars to 0-100 scale', () => {
    expect(calculateRatingScore(5.0)).toBe(100);
    expect(calculateRatingScore(4.5)).toBe(90);
    expect(calculateRatingScore(4.0)).toBe(80);
  });

  test('calculateReviewConfidence penalizes very low review counts', () => {
    const lowCountConfidence = calculateReviewConfidence(2);
    const highCountConfidence = calculateReviewConfidence(18000);
    expect(lowCountConfidence).toBeLessThan(50);
    expect(highCountConfidence).toBeGreaterThanOrEqual(95);
  });

  test('calculateValueScore computes overall value score correctly with weights', () => {
    const mockOffer = {
      price: 68499,
      originalPrice: 79900,
      rating: 4.5,
      reviewCount: 18200,
      sellerName: 'Apple Authorized Seller',
      deliveryInfo: 'Tomorrow Delivery',
    };

    const breakdown = calculateValueScore(mockOffer, 68499, true, DEFAULT_SCORING_WEIGHTS);

    expect(breakdown.overallValueScore).toBeGreaterThanOrEqual(85);
    expect(breakdown.overallValueScore).toBeLessThanOrEqual(100);
    expect(breakdown.priceScore).toBeGreaterThan(80);
    expect(breakdown.ratingScore).toBe(90);
  });
});
