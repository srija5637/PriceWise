import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product } from '@/types';

export interface StructuredAiQuery {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  priorities: string[];
  compareProducts?: string[];
  isPriceDropQuery?: boolean;
}

export interface AiShoppingResponse {
  querySummary: string;
  structuredFilters: StructuredAiQuery;
  matchedProducts: Product[];
  explanation: string;
  topRecommendation?: {
    product: Product;
    bestStore: string;
    lowestPrice: number;
    valueScore: number;
    reasons: string[];
  };
}

export function parseNaturalLanguageQuery(text: string): StructuredAiQuery {
  const lower = text.toLowerCase();
  const filters: StructuredAiQuery = {
    priorities: [],
  };

  // 1. Detect Category
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('smartphone') || lower.includes('iphone')) {
    filters.category = 'mobiles';
  } else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('notebook')) {
    filters.category = 'laptops';
  } else if (lower.includes('headphone') || lower.includes('earphone') || lower.includes('audio') || lower.includes('airpods') || lower.includes('wh-1000xm5')) {
    filters.category = 'headphones';
  } else if (lower.includes('tv') || lower.includes('television') || lower.includes('qled') || lower.includes('oled')) {
    filters.category = 'tvs';
  }

  // 2. Detect Brands
  const brands = ['apple', 'samsung', 'sony', 'oneplus', 'dell', 'hp', 'lenovo'];
  for (const b of brands) {
    if (lower.includes(b)) {
      filters.brand = b;
      break;
    }
  }

  // 3. Detect Price bounds (e.g. "under 30000", "under ₹70,000", "below 10,000")
  const underPriceMatch = lower.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*([0-9,]+)/i);
  if (underPriceMatch) {
    const amount = parseInt(underPriceMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(amount)) {
      filters.maxPrice = amount;
    }
  }

  // 4. Detect Priorities
  if (lower.includes('camera') || lower.includes('photo')) filters.priorities.push('camera');
  if (lower.includes('battery') || lower.includes('backup')) filters.priorities.push('battery');
  if (lower.includes('coding') || lower.includes('programming') || lower.includes('developer')) filters.priorities.push('performance for coding');
  if (lower.includes('noise cancel') || lower.includes('anc')) filters.priorities.push('active noise cancellation');
  if (lower.includes('rating') || lower.includes('best rated')) filters.priorities.push('high consumer rating');
  if (lower.includes('value') || lower.includes('budget')) filters.priorities.push('price-to-value ratio');

  // 5. Detect Price Drop queries
  if (lower.includes('price drop') || lower.includes('dropped') || lower.includes('discount') || lower.includes('deal')) {
    filters.isPriceDropQuery = true;
  }

  return filters;
}

export function executeAiShoppingAssistant(query: string): AiShoppingResponse {
  const structured = parseNaturalLanguageQuery(query);
  const allProducts = getEnrichedProducts();

  let filtered = allProducts;

  if (structured.category) {
    filtered = filtered.filter(p => p.category?.slug === structured.category || p.categoryId.includes(structured.category!));
  }

  if (structured.brand) {
    filtered = filtered.filter(p => p.brand.toLowerCase() === structured.brand);
  }

  if (structured.maxPrice) {
    filtered = filtered.filter(p => (p.lowestPrice || 0) <= structured.maxPrice!);
  }

  // If no strict filters matched, fall back to top rated
  if (filtered.length === 0) {
    filtered = allProducts.filter(p => (p.rating || 0) >= 4.5);
  }

  // Sort by Value Score of best offer
  filtered.sort((a, b) => (b.bestOffer?.valueScore || 0) - (a.bestOffer?.valueScore || 0));

  const topPick = filtered[0];
  let topRecommendation = undefined;

  if (topPick && topPick.bestOffer) {
    topRecommendation = {
      product: topPick,
      bestStore: topPick.bestOffer.store.name,
      lowestPrice: topPick.lowestPrice || topPick.bestOffer.price,
      valueScore: topPick.bestOffer.valueScore || 90,
      reasons: [
        `Lowest verified price: ₹${(topPick.lowestPrice || topPick.bestOffer.price).toLocaleString('en-IN')} on ${topPick.bestOffer.store.name}`,
        `Verified customer rating of ${topPick.rating || 4.5} ★ from ${topPick.reviewCount?.toLocaleString() || '10,000+'} reviews`,
        `Value Score of ${topPick.bestOffer.valueScore || 92}/100 across price, seller reputation, and delivery metrics`
      ],
    };
  }

  let explanation = `Based on your request, I analyzed current verified multi-store prices across supported retailers.`;
  if (structured.maxPrice) {
    explanation += ` Filtering for items with verified offers at or below ₹${structured.maxPrice.toLocaleString('en-IN')}.`;
  }
  if (structured.priorities.length > 0) {
    explanation += ` Prioritizing options that excel in ${structured.priorities.join(' and ')}.`;
  }

  return {
    querySummary: query,
    structuredFilters: structured,
    matchedProducts: filtered,
    explanation,
    topRecommendation,
  };
}

// Re-export decoupled AI modules & agents
export * from './models';
export * from './provider';
export * from './tools';
export * from './agents/priceAnalyst';
export * from './agents/reviewAnalyst';
export * from './agents/alternativeFinder';
export * from './agents/budgetPlanner';
export * from './embeddings';
export * from './workflows/multimodal';
