'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import type { ArrivalKey } from '@/config/arrivals';
import type { MoodId } from '@/types/mood';
import type { Intent } from '@/types/content';

/**
 * Nombre de un estado del ánimo para decirlo en voz alta («Cansancio», «Claridad»): el del
 * diario si es un estado, el de la intención si viene de Descúbrete.
 */
export function useFeelingLabel(): (key: ArrivalKey) => string {
  const tJournal = useTranslations('journal');
  const tDiscover = useTranslations('discover');

  return useCallback(
    (key: ArrivalKey) => {
      const [kind, id] = key.split(':') as ['mood' | 'intent', string];

      return kind === 'mood'
        ? tJournal(`moods.${id as MoodId}`)
        : tDiscover(`intents.${id as Intent}.name`);
    },
    [tJournal, tDiscover],
  );
}
