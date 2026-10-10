'use client';

import { useTranslations } from 'next-intl';

import { EmptyState } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

/** El diario en blanco: vacío luminoso sobre su banda editorial, no una ausencia. */
export function JournalEmpty({ media }: { media: EditorialMedia }) {
  const t = useTranslations('states');

  return <EmptyState media={media} title={t('emptyJournal')} className="mt-6" />;
}
