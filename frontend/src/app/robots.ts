import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/page-metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // El catálogo del UI Kit sólo existe en desarrollo.
        disallow: ['/kit', '/es/kit', '/en/kit'],
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  };
}
