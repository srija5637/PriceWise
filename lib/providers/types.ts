// Modular Data Provider Interface for PriceWise

export interface ExtractedProductListing {
  storeName: string;
  storeDomain: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  sellerName?: string;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  deliveryInfo?: string;
  warrantyInfo?: string;
  url: string;
  imageUrl?: string;
  lastCheckedAt: string;
  rawAttributes?: Record<string, string>;
}

export interface ProviderStoreStatus {
  storeName: string;
  status: 'pending' | 'success' | 'failed' | 'skipped';
  message?: string;
  offerCount?: number;
}

export interface ProductDataProvider {
  name: string;
  isConfigured(): boolean;
  search(query: string): Promise<ExtractedProductListing[]>;
  getProduct(url: string): Promise<ExtractedProductListing | null>;
}
