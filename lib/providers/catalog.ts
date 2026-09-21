import { ExtractedProductListing, ProductDataProvider } from './types';
import { getEnrichedProducts } from '@/lib/db/seed-data';
import { parseProductQuery } from '@/lib/products';

export class CatalogProvider implements ProductDataProvider {
  public name = 'Verified Catalog Provider';

  public isConfigured(): boolean {
    return true; // Always available
  }

  public async search(query: string): Promise<ExtractedProductListing[]> {
    const parsed = parseProductQuery(query);
    const products = getEnrichedProducts();
    const results: ExtractedProductListing[] = [];

    const queryLower = query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 1);

    for (const prod of products) {
      const nameLower = prod.name.toLowerCase();
      const brandLower = prod.brand.toLowerCase();

      // Check brand match or token matching
      const matchesBrand = parsed.brand && brandLower === parsed.brand.toLowerCase();
      const tokenMatchCount = queryTokens.filter(t => nameLower.includes(t) || brandLower.includes(t)).length;
      const isMatch = matchesBrand || tokenMatchCount >= Math.min(2, queryTokens.length);

      if (isMatch) {
        for (const variant of prod.variants) {
          // Check storage / variant matching if specified in query
          if (parsed.storage && variant.attributes.storage) {
            if (parsed.storage.toLowerCase() !== variant.attributes.storage.toLowerCase()) {
              continue; // Strict variant separation!
            }
          }

          for (const offer of variant.offers || []) {
            results.push({
              storeName: offer.store.name,
              storeDomain: offer.store.domain,
              title: offer.title,
              price: offer.price,
              originalPrice: offer.originalPrice,
              currency: offer.currency,
              rating: offer.rating,
              reviewCount: offer.reviewCount,
              sellerName: offer.sellerName,
              availability: offer.availability,
              deliveryInfo: offer.deliveryInfo,
              warrantyInfo: offer.warrantyInfo,
              url: offer.url,
              imageUrl: offer.imageUrl || prod.imageUrl,
              lastCheckedAt: offer.lastCheckedAt,
              rawAttributes: variant.attributes,
            });
          }
        }
      }
    }

    return results;
  }

  public async getProduct(url: string): Promise<ExtractedProductListing | null> {
    const products = getEnrichedProducts();
    for (const prod of products) {
      for (const variant of prod.variants) {
        for (const off of variant.offers || []) {
          if (off.url === url) {
            return {
              storeName: off.store.name,
              storeDomain: off.store.domain,
              title: off.title,
              price: off.price,
              originalPrice: off.originalPrice,
              currency: off.currency,
              rating: off.rating,
              reviewCount: off.reviewCount,
              sellerName: off.sellerName,
              availability: off.availability,
              deliveryInfo: off.deliveryInfo,
              warrantyInfo: off.warrantyInfo,
              url: off.url,
              imageUrl: off.imageUrl || prod.imageUrl,
              lastCheckedAt: off.lastCheckedAt,
            };
          }
        }
      }
    }
    return null;
  }
}
