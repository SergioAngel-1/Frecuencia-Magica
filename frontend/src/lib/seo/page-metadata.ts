import type { Metadata } from 'next';

import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

/** Base de URLs absolutas. Segura de leer en tests: si falta, cae a localhost. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** La marca se escribe igual en ambos idiomas (regla 7.2.3 del informe de copy). */
export const SITE_NAME = 'Frecuencia Mágica';

/** Imagen al compartir el enlace (1200×630 JPEG: las redes no leen AVIF de forma fiable). */
export const OG_IMAGE = { url: '/editorial/og-image.jpg', width: 1200, height: 630 } as const;

type PageHref = Parameters<typeof getPathname>[0]['href'];

export type PageMetadataInput = {
  locale: Locale;
  /**
   * Ruta localizada del catálogo de `i18n/routing` —la misma que usa `Link`.
   * Acepta el objeto `{ pathname, params }` de las rutas dinámicas.
   */
  pathname: PageHref;
  /** Título sin marca: el layout añade ` · Frecuencia Mágica`. */
  title: string;
  description: string;
  /** Título completo, sin plantilla (el portal es la raíz del sitio). */
  absoluteTitle?: boolean;
  /** `alt` de la imagen OG, ya traducido. */
  imageAlt: string;
  /** Fuera de los buscadores (acceso, carrito, Mi Santuario, lecciones). */
  noindex?: boolean;
  /** Inyectable para testear; por defecto, `NEXT_PUBLIC_SITE_URL`. */
  siteUrl?: string;
};

const OG_LOCALES = { es: 'es_ES', en: 'en_US' } as const;

/**
 * Metadatos de una vista: title, description, canonical autorreferente,
 * `hreflang` (es, en, x-default→es) y Open Graph. Lógica pura: la base de URL
 * entra por parámetro (o por `NEXT_PUBLIC_SITE_URL`) y todo lo demás por
 * argumento, para poder testearla sin entorno.
 */
export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
  absoluteTitle = false,
  imageAlt,
  noindex = false,
  siteUrl = SITE_URL,
}: PageMetadataInput): Metadata {
  const canonical = new URL(getPathname({ locale, href: pathname }), siteUrl).toString();
  const esUrl = new URL(getPathname({ locale: 'es', href: pathname }), siteUrl).toString();
  const enUrl = new URL(getPathname({ locale: 'en', href: pathname }), siteUrl).toString();
  const openGraphTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: { es: esUrl, en: enUrl, 'x-default': esUrl },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: openGraphTitle,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: locale === 'es' ? OG_LOCALES.en : OG_LOCALES.es,
      url: canonical,
      images: [{ ...OG_IMAGE, alt: imageAlt }],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
