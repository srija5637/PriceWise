// Core Types for PriceWise Shopping Intelligence Platform

export interface ValueScoreBreakdown {
  priceScore: number;       // 40%
  ratingScore: number;      // 25%
  reviewConfidence: number; // 15%
  sellerScore: number;      // 10%
  deliveryScore: number;    // 10%
  overallValueScore: number;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  rating: number;
  verified: boolean;
}

export interface Offer {
  id: string;
  productVariantId: string;
  storeId: string;
  store: Store;
  title: string;
  url: string;
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  sellerName?: string;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  deliveryInfo?: string;
  warrantyInfo?: string;
  imageUrl?: string;
  lastCheckedAt: string;
  valueScore?: number;
  valueScoreBreakdown?: ValueScoreBreakdown;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantName: string;
  attributes: Record<string, string>; // e.g. { storage: "128GB", ram: "8GB", color: "Black" }
  sku?: string;
  gtin?: string;
  offers?: Offer[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  specKeys: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  categoryId: string;
  category?: Category;
  description: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  specs?: Record<string, string>;
  specifications?: Record<string, string>;
  variants: ProductVariant[];
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
  bestOffer?: Offer;
  priceHistory?: PriceHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistoryItem {
  id: string;
  offerId: string;
  storeName?: string;
  price: number;
  currency: string;
  recordedAt: string; // ISO date string
}

export type PriceHistoryPoint = PriceHistoryItem;

export interface WatchlistItem {
  id: string;
  userId: string;
  productVariantId: string;
  variant: ProductVariant;
  product: Product;
  targetPrice?: number;
  currentPrice: number;
  lowestPrice: number;
  priceChangePercent: number;
  bestStore: Store;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productVariantId: string;
  variant: ProductVariant;
  product: Product;
  targetPrice: number;
  currentPrice: number;
  currency: string;
  enabled: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export interface SearchQueryAnalysis {
  rawQuery: string;
  normalizedQuery: string;
  category?: string;
  brand?: string;
  model?: string;
  variant?: string;
  attributes: Record<string, string>;
}

export interface FilterState {
  priceMin?: number;
  priceMax?: number;
  brands: string[];
  stores: string[];
  minRating?: number;
  minReviews?: number;
  minDiscount?: number;
  inStockOnly: boolean;
  fastDeliveryOnly: boolean;
  sortBy: 'lowest_price' | 'highest_price' | 'highest_rating' | 'most_reviews' | 'biggest_discount' | 'best_value' | 'recently_updated';
}

export interface ReviewAnalysisSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    stars5: number;
    stars4: number;
    stars3: number;
    stars2: number;
    stars1: number;
  };
  positiveThemes: string[];
  negativeThemes: string[];
  commonStrengths: string[];
  commonComplaints: string[];
  sourceAttribution: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}
