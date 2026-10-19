import { describe, expect, it, vi } from 'vitest';

import { buildPageMetadata, OG_IMAGE, SITE_NAME } from '@/lib/seo/page-metadata';

// `next-intl/navigation` importa `next/navigation` sin extensión y Node no lo
// resuelve en Vitest. El mock replica la localización del catálogo real.
vi.mock('@/i18n/navigation', async () => {
  const { routing } = await import('@/i18n/routing');

  return {
    getPathname: ({
      locale,
      href,
    }: {
      locale: 'es' | 'en';
      href: string | { pathname: string; params?: Record<string, string> };
    }) => {
      const pathname = typeof href === 'string' ? href : href.pathname;
      const params = typeof href === 'string' ? {} : (href.params ?? {});
      const entry = routing.pathnames[pathname as keyof typeof routing.pathnames];
      const localized = typeof entry === 'string' ? entry : (entry?.[locale] ?? pathname);
      const path = localized.replace(/\[([^\]]+)\]/g, (_, key: string) => params[key] ?? '');

      if (locale === routing.defaultLocale) return path;
      return path === '/' ? `/${locale}` : `/${locale}${path}`;
    },
  };
});

const SITE_URL = 'https://frecuencia.test';
const DESCRIPTION =
  'Meditaciones guiadas, frecuencias y paisajes sonoros para descansar, enraizarte o volver a respirar.';
const IMAGE_ALT = 'Un aro de luz dorada sobre un mar nocturno en calma';

function metadataFor(locale: 'es' | 'en') {
  return buildPageMetadata({
    locale,
    pathname: '/resonario',
    title: 'Meditaciones y frecuencias',
    description: DESCRIPTION,
    imageAlt: IMAGE_ALT,
    siteUrl: SITE_URL,
  });
}

describe('buildPageMetadata', () => {
  it('emite canonical autorreferente y hreflang es/en/x-default', () => {
    expect(metadataFor('es').alternates).toEqual({
      canonical: `${SITE_URL}/resonario`,
      languages: {
        es: `${SITE_URL}/resonario`,
        en: `${SITE_URL}/en/resonarium`,
        'x-default': `${SITE_URL}/resonario`,
      },
    });
  });

  it('en inglés, el canonical apunta a su ruta localizada', () => {
    expect(metadataFor('en').alternates).toEqual({
      canonical: `${SITE_URL}/en/resonarium`,
      languages: {
        es: `${SITE_URL}/resonario`,
        en: `${SITE_URL}/en/resonarium`,
        'x-default': `${SITE_URL}/resonario`,
      },
    });
  });

  it('localiza también las rutas dinámicas', () => {
    const metadata = buildPageMetadata({
      locale: 'en',
      pathname: { pathname: '/academia/[courseId]', params: { courseId: 'c1' } },
      title: 'Course: The Art of Returning to You',
      description: DESCRIPTION,
      imageAlt: IMAGE_ALT,
      siteUrl: SITE_URL,
    });

    expect(metadata.alternates).toEqual({
      canonical: `${SITE_URL}/en/academy/c1`,
      languages: {
        es: `${SITE_URL}/academia/c1`,
        en: `${SITE_URL}/en/academy/c1`,
        'x-default': `${SITE_URL}/academia/c1`,
      },
    });
  });

  it('deja el título a la plantilla del layout y añade la marca en Open Graph', () => {
    const metadata = metadataFor('es');

    expect(metadata.title).toBe('Meditaciones y frecuencias');
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: SITE_NAME,
      title: `Meditaciones y frecuencias · ${SITE_NAME}`,
      description: DESCRIPTION,
      locale: 'es_ES',
      alternateLocale: 'en_US',
      url: `${SITE_URL}/resonario`,
      images: [{ ...OG_IMAGE, alt: IMAGE_ALT }],
    });
  });

  it('usa el título completo cuando la vista es la raíz', () => {
    const metadata = buildPageMetadata({
      locale: 'es',
      pathname: '/',
      title: `Bienestar y rituales para volver a ti · ${SITE_NAME}`,
      description: DESCRIPTION,
      absoluteTitle: true,
      imageAlt: IMAGE_ALT,
      siteUrl: SITE_URL,
    });

    expect(metadata.title).toEqual({
      absolute: `Bienestar y rituales para volver a ti · ${SITE_NAME}`,
    });
    expect(metadata.openGraph).toMatchObject({
      title: `Bienestar y rituales para volver a ti · ${SITE_NAME}`,
    });
  });

  it('añade noindex, nofollow sólo cuando se pide', () => {
    const indexable = metadataFor('es');
    const hidden = buildPageMetadata({
      locale: 'es',
      pathname: '/mi-santuario',
      title: 'Mi Santuario: tu diario de bienestar',
      description: DESCRIPTION,
      imageAlt: IMAGE_ALT,
      noindex: true,
      siteUrl: SITE_URL,
    });

    expect(indexable.robots).toBeUndefined();
    expect(hidden.robots).toEqual({ index: false, follow: false });
  });

  it('no reescribe la descripción: las longitudes se validan en el copy', () => {
    expect(metadataFor('es').description).toBe(DESCRIPTION);
  });
});
