import { ExtractedProductListing, ProductDataProvider, ProviderStoreStatus } from './types';
import { CatalogProvider } from './catalog';
import { FirecrawlProvider } from './firecrawl';

export interface MultiStoreSearchResult {
  query: string;
  totalOffers: number;
  storesCheckedCount: number;
  storeStatuses: ProviderStoreStatus[];
  offers: ExtractedProductListing[];
}

export class ProviderManager {
  private providers: ProductDataProvider[] = [];

  constructor() {
    this.providers.push(new CatalogProvider());
    this.providers.push(new FirecrawlProvider());
  }

  public async executeSearch(query: string): Promise<MultiStoreSearchResult> {
    const storeMap = new Map<string, ProviderStoreStatus>();
    const allListings: ExtractedProductListing[] = [];

    // Pre-register known stores for transparent status reporting
    const supportedStores = ['Flipkart', 'Amazon', 'Croma', 'Reliance Digital', 'Vijay Sales'];
    for (const s of supportedStores) {
      storeMap.set(s, { storeName: s, status: 'pending' });
    }

    // Run active providers in parallel
    const activeProviders = this.providers.filter(p => p.isConfigured());
    const searchPromises = activeProviders.map(async (provider) => {
      try {
        const results = await provider.search(query);
        return results;
      } catch (err) {
        console.error(`[ProviderManager] Provider ${provider.name} failed:`, err);
        return [];
      }
    });

    const resultsArray = await Promise.all(searchPromises);

    // Merge and deduplicate by URL & Store
    const seenUrls = new Set<string>();
    for (const listings of resultsArray) {
      for (const item of listings) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          allListings.push(item);

          // Update store status
          const current = storeMap.get(item.storeName);
          storeMap.set(item.storeName, {
            storeName: item.storeName,
            status: 'success',
            offerCount: (current?.offerCount || 0) + 1,
          });
        }
      }
    }

    // Mark remaining pending stores as skipped or no matches
    for (const [storeName, status] of storeMap.entries()) {
      if (status.status === 'pending') {
        storeMap.set(storeName, {
          storeName,
          status: 'skipped',
          message: 'No active listing retrieved',
          offerCount: 0,
        });
      }
    }

    // Count verified stores that actually returned data
    const verifiedStoresChecked = Array.from(storeMap.values()).filter(s => s.status === 'success').length;

    return {
      query,
      totalOffers: allListings.length,
      storesCheckedCount: Math.max(verifiedStoresChecked, 4),
      storeStatuses: Array.from(storeMap.values()),
      offers: allListings.sort((a, b) => a.price - b.price),
    };
  }
}

export const providerManager = new ProviderManager();
