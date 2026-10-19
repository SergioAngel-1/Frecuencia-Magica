import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { BookingFlow } from '@/components/features/experiences/booking-flow';
import { PageShell } from '@/components/layout';
import { getExperience } from '@/data/experiences';
import { messageKey } from '@/i18n/keys';
import { resolveLocale } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { routing } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string; experienceId: string }> };

/**
 * Sólo existen los ids del catálogo. El 404 de uno desconocido sale con su
 * estado real porque el `loading.tsx` del realm vive en `(catalogo)/` y no
 * envuelve esta ruta: un `notFound()` dentro del streaming responde 200.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ['e1', 'e2', 'e3', 'e4'].map((experienceId) => ({ locale, experienceId })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { experienceId } = await params;
  const experience = getExperience(experienceId);
  if (!experience) return {};

  const locale = await resolveLocale(params);
  const [t, booking, common] = await Promise.all([
    getTranslations({ locale, namespace: 'experiences' }),
    getTranslations({ locale, namespace: 'booking' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const title = t(messageKey('experiences', experience.titleKey));

  return buildPageMetadata({
    locale,
    pathname: {
      pathname: '/experiencias/[experienceId]/reservar',
      params: { experienceId: experience.id },
    },
    title: booking('meta.title', { title }),
    description: booking('meta.description', { title }),
    imageAlt: common('ogImageAlt'),
  });
}

export default async function BookingPage({ params }: PageProps) {
  const { experienceId } = await params;
  const locale = await resolveLocale(params);
  const bookingT = await getTranslations({ locale, namespace: 'booking' });

  const experience = getExperience(experienceId);
  if (!experience) notFound();

  const bookingMedia = {
    hero: resolveEditorialMedia('booking.hero', {
      alt: bookingT('media.alt.hero'),
      sizes: '(min-width: 1280px) 1200px, 100vw',
      band: experience.band,
    }),
    confirmation: resolveEditorialMedia('booking.confirmation', {
      alt: bookingT('media.alt.confirmation'),
      sizes: '(min-width: 1280px) 1000px, calc(100vw - 48px)',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <BookingFlow experience={experience} media={bookingMedia} />
    </PageShell>
  );
}
