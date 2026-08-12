import { getTranslations } from 'next-intl/server';

import { QuizContainer } from '@/components/features/descubrete/quiz-container';
import { AUDIOS } from '@/data/audios';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'discover' });

  return { title: t('title') };
}

export default async function DiscoverPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'discover' });
  const discoverMedia = {
    hero: resolveEditorialMedia('discover.hero', { alt: t('media.alt.hero') }),
    question: resolveEditorialMedia('discover.question-atmosphere', {
      alt: t('media.alt.questionAtmosphere'),
      sizes: '100vw',
    }),
    tuning: resolveEditorialMedia('discover.tuning', { alt: t('media.alt.tuning') }),
    result: resolveEditorialMedia('discover.result', { alt: t('media.alt.result') }),
  };

  return <QuizContainer audios={AUDIOS} media={discoverMedia} />;
}
