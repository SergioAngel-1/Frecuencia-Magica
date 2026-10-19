import type { MetadataRoute } from 'next';

import { COURSES } from '@/data/courses';
import { PRODUCTS } from '@/data/products';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo/page-metadata';

type PageHref = Parameters<typeof getPathname>[0]['href'];

/**
 * Sólo rutas públicas e indexables. Quedan fuera `/kit`, acceso, carrito,
 * Mi Santuario, las lecciones (noindex) y `/reservar` (flujo transaccional).
 */
const PUBLIC_PAGES: readonly PageHref[] = [
  '/',
  '/inicio',
  '/descubrete',
  '/resonario',
  '/academia',
  '/experiencias',
  '/tienda',
  '/sobre-marisol',
];

const DETAIL_PAGES: readonly PageHref[] = [
  ...COURSES.map(
    (course) =>
      ({
        pathname: '/academia/[courseId]',
        params: { courseId: course.id },
      }) as const,
  ),
  ...PRODUCTS.map(
    (product) =>
      ({
        pathname: '/tienda/[productId]',
        params: { productId: product.id },
      }) as const,
  ),
];

function absolute(locale: (typeof routing.locales)[number], href: PageHref): string {
  return new URL(getPathname({ locale, href }), SITE_URL).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PUBLIC_PAGES, ...DETAIL_PAGES].flatMap((href) => {
    const languages = {
      es: absolute('es', href),
      en: absolute('en', href),
      'x-default': absolute('es', href),
    };

    return routing.locales.map((locale) => ({
      url: absolute(locale, href),
      alternates: { languages },
    }));
  });
}
