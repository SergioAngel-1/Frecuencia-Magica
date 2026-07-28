import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { BookingFlow } from '@/components/features/experiences/booking-flow';
import { PageShell } from '@/components/layout';
import { getExperience } from '@/data';
import { resolveLocale } from '@/i18n/resolve-locale';
import { routing } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string; experienceId: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ['e1', 'e2', 'e3', 'e4'].map((experienceId) => ({ locale, experienceId })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { experienceId } = await params;
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'experiences' });

  return { title: t(`items.${experienceId}.title` as 'items.e1.title') };
}

export default async function BookingPage({ params }: PageProps) {
  const { experienceId } = await params;
  await resolveLocale(params);

  const experience = getExperience(experienceId);
  if (!experience) notFound();

  return (
    <PageShell width="focus">
      <BookingFlow experience={experience} />
    </PageShell>
  );
}
