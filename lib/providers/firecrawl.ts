import { ExtractedProductListing, ProductDataProvider } from './types';

export class FirecrawlProvider implements ProductDataProvider {
  public name = 'Firecrawl Web Scraper';
  private apiKey: string | undefined;
  private baseUrl = 'https://api.firecrawl.dev/v1';

  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.includes('your-firecrawl-api-key'));
  }

  public async search(query: string): Promise<ExtractedProductListing[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      // Firecrawl permitted search / extract API call with timeout guard
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `${query} site:amazon.in OR site:flipkart.com OR site:croma.com`,
          limit: 5,
          scrapeOptions: {
            formats: ['json'],
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Firecrawl] HTTP Error ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      if (!data?.data || !Array.isArray(data.data)) {
        return [];
      }

      // Normalize extracted listings
      const listings: ExtractedProductListing[] = [];
      for (const item of data.data) {
        if (item.url && item.metadata?.title) {
          listings.push({
            storeName: this.extractStoreNameFromUrl(item.url),
            storeDomain: new URL(item.url).hostname,
            title: item.metadata.title,
            price: item.metadata.price || 0,
            currency: 'INR',
            url: item.url,
            availability: 'In Stock',
            lastCheckedAt: new Date().toISOString(),
          });
        }
      }

      return listings;
    } catch (err: unknown) {
      console.warn('[Firecrawl] Search error or timeout:', err instanceof Error ? err.message : err);
      return [];
    }
  }

  public async getProduct(url: string): Promise<ExtractedProductListing | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['json'],
        }),
      });

      if (!response.ok) return null;
      const result = await response.json();
      const meta = result?.data?.metadata;
      if (!meta) return null;

      return {
        storeName: this.extractStoreNameFromUrl(url),
        storeDomain: new URL(url).hostname,
        title: meta.title || 'Product Offer',
        price: meta.price || 0,
        currency: 'INR',
        url,
        availability: 'In Stock',
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('[Firecrawl] Scrape failed:', err);
      return null;
    }
  }

  private extractStoreNameFromUrl(url: string): string {
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host.includes('amazon')) return 'Amazon';
      if (host.includes('flipkart')) return 'Flipkart';
      if (host.includes('croma')) return 'Croma';
      if (host.includes('reliancedigital')) return 'Reliance Digital';
      if (host.includes('vijaysales')) return 'Vijay Sales';
      if (host.includes('myntra')) return 'Myntra';
      return host.replace('www.', '').split('.')[0];
    } catch {
      return 'Store';
    }
  }
}
