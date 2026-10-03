'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { ResultStepProps } from '@/components/features/descubrete/result-step';
import { recommend, type DiscoverCatalog } from '@/lib/discover/recommend';
import { categoryKey } from '@/lib/store/category-key';
import type { Audio, Question } from '@/types/content';

export type DiscoverResultView = Omit<ResultStepProps, 'onListen' | 'onRestart'> & {
  audio: Audio;
};

/**
 * Recomendación de Descúbrete ya traducida para `ResultStep`. La decisión es
 * de `recommend` (pura); este hook sólo pone nombres a lo elegido. `null`
 * mientras el quiz no ha terminado o si algún catálogo viene vacío.
 */
export function useDiscoverResult(
  answers: Readonly<Record<string, number>>,
  questions: readonly Question[],
  catalog: DiscoverCatalog,
  enabled: boolean,
): DiscoverResultView | null {
  const t = useTranslations('discover');
  const tResonario = useTranslations('resonario');
  const tAcademy = useTranslations('academy');
  const tExperiences = useTranslations('experiences');
  const tStore = useTranslations('store');

  const recommendation = useMemo(
    () => (enabled ? recommend(answers, questions, catalog) : null),
    [enabled, answers, questions, catalog],
  );

  if (!recommendation) return null;

  const { reading, audio, course, experience, product } = recommendation;

  return {
    audio,
    kicker: t('result.kicker'),
    intent: t(`intents.${reading.primary}.name`),
    description: t(`intents.${reading.primary}.description`),
    audioTitle: tResonario(`audios.${audio.id}.title` as 'audios.a1.title'),
    ctaLabel: t('result.cta'),
    restartLabel: t('result.restart'),
    pathKicker: t('result.pathKicker'),
    pathTitle: t('result.pathTitle'),
    recommendations: [
      {
        id: course.id,
        kind: t('result.kinds.course'),
        title: tAcademy(`courses.${course.id}.title` as 'courses.c1.title'),
        meta: `${tAcademy('lessonsCount', { count: course.lessons })} · ${course.hours}`,
        band: course.band,
        href: { pathname: '/academia/[courseId]', params: { courseId: course.id } },
        openLabel: t('result.open.course'),
      },
      {
        id: experience.id,
        kind: t('result.kinds.experience'),
        title: tExperiences(`items.${experience.id}.title` as 'items.e1.title'),
        meta: `${tExperiences(`modes.${experience.mode}`)} · ${experience.dur}`,
        band: experience.band,
        href: {
          pathname: '/experiencias/[experienceId]/reservar',
          params: { experienceId: experience.id },
        },
        openLabel: t('result.open.experience'),
      },
      {
        id: product.id,
        kind: t('result.kinds.product'),
        title: tStore(`products.${product.id}.title` as 'products.p1.title'),
        meta: tStore(categoryKey(product.catKey)),
        band: product.band,
        href: { pathname: '/tienda/[productId]', params: { productId: product.id } },
        openLabel: t('result.open.product'),
      },
    ],
  };
}
