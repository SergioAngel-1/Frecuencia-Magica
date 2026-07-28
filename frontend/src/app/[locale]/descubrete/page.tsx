import { getTranslations } from 'next-intl/server';

import { QuizContainer } from '@/components/features/descubrete/quiz-container';
import { AUDIOS } from '@/data/audios';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'discover' });

  return { title: t('title') };
}

export default async function DiscoverPage({ params }: PageProps) {
  await resolveLocale(params);

  return <QuizContainer audios={AUDIOS} />;
}
