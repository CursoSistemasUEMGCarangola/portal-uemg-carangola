import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/restrito/', '/api/'],
    },
    sitemap: 'https://carangola.uemg.br/sitemap.xml',
  };
}
