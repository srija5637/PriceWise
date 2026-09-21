import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pricewise.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/product/', '/compare', '/deals', '/trending', '/categories/', '/stores', '/help'],
      disallow: ['/admin/', '/settings/', '/watchlist', '/alerts', '/history', '/shopping-lists', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
