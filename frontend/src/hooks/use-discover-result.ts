'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { ResultStepProps } from '@/components/features/descubrete/result-step';
import { recommend, type DiscoverCatalog } from '@/lib/discover/recommend';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { categoryKey } from '@/lib/store/category-key';
import type { Audio, Question } from '@/types/content';

/** Tres tarjetas por fila desde 768 px, dentro de un ancho máximo de 1040 px. */
const CARD_SIZES = '(min-width: 1088px) 334px, (min-width: 768px) 31vw, calc(100vw - 48px)';

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
  const courseTitle = tAcademy(`courses.${course.id}.title` as 'courses.c1.title');
  const experienceTitle = tExperiences(`items.${experience.id}.title` as 'items.e1.title');
  const productTitle = tStore(`products.${product.id}.title` as 'products.p1.title');

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
        title: courseTitle,
        meta: `${tAcademy('lessonsCount', { count: course.lessons })} · ${course.hours}`,
        // Cada tarjeta pinta la imagen de su ítem: el mismo slot e instancia
        // que su realm, con la banda del ítem como fallback.
        media: resolveEditorialMedia('academy-course-cover', {
          instance: course.id,
          alt: tAcademy('media.alt.courseCover', { title: courseTitle }),
          sizes: CARD_SIZES,
          band: course.band,
        }),
        href: { pathname: '/academia/[courseId]', params: { courseId: course.id } },
        openLabel: t('result.open.course'),
      },
      {
        id: experience.id,
        kind: t('result.kinds.experience'),
        title: experienceTitle,
        meta: `${tExperiences(`modes.${experience.mode}`)} · ${experience.dur}`,
        media: resolveEditorialMedia('experiences-visual', {
          instance: experience.id,
          alt: tExperiences('media.alt.row', { title: experienceTitle }),
          sizes: CARD_SIZES,
          band: experience.band,
        }),
        href: {
          pathname: '/experiencias/[experienceId]/reservar',
          params: { experienceId: experience.id },
        },
        openLabel: t('result.open.experience'),
      },
      {
        id: product.id,
        kind: t('result.kinds.product'),
        title: productTitle,
        meta: tStore(categoryKey(product.catKey)),
        media: resolveEditorialMedia('store-product-visual', {
          instance: product.id,
          alt: tStore('media.alt.product', { title: productTitle }),
          sizes: CARD_SIZES,
          band: product.band,
        }),
        href: { pathname: '/tienda/[productId]', params: { productId: product.id } },
        openLabel: t('result.open.product'),
      },
    ],
  };
}
