'use client';

import { useTranslations } from 'next-intl';

import { EditorialImage, EmptyState } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

/** El diario en blanco: vacío luminoso sobre su banda editorial, no una ausencia. */
export function JournalEmpty({ media }: { media: EditorialMedia }) {
  const t = useTranslations('states');

  return (
    <div
      className="rounded-card relative isolate mt-6 overflow-hidden"
      data-editorial-media="sanctuary.empty"
    >
      <div className="absolute inset-0">
        <EditorialImage
          aspect="16:9"
          className="h-full"
          media={media}
          overlay={false}
          scrim="bottom"
        />
      </div>
      <EmptyState title={t('emptyJournal')} className="relative z-10" />
    </div>
  );
}
