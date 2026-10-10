'use client';

import { useTranslations } from 'next-intl';

import { EmptyState } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

/** El diario en blanco: vacío luminoso sobre su banda editorial, no una ausencia. */
export function JournalEmpty({ media }: { media: EditorialMedia }) {
  const t = useTranslations('states');

  // `fill`: el vacío mide lo que su texto y no estira la columna del retrato.
  return <EmptyState media={media} fill title={t('emptyJournal')} className="mt-6" />;
}
