'use client';

import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';
import type { JournalEntry } from '@/stores/journal-store';
import type { MoodId } from '@/types/mood';

/**
 * Punto de color de cada estado, dentro de la paleta cerrada. Un estado no
 * reconocido (`null`) lleva el punto neutro.
 */
const MOOD_DOT: Record<MoodId | 'unknown', string> = {
  calm: 'bg-accent-2',
  tiredness: 'bg-fg/45',
  nostalgia: 'bg-accent-3',
  sadness: 'bg-fg/30',
  joy: 'bg-accent',
  gratitude: 'bg-fg',
  clarity: 'bg-accent',
  unknown: 'bg-fg/20',
};

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const t = useTranslations('journal');
  const locale = useLocale();
  const mood = entry.mood ?? 'unknown';
  const date = new Date(entry.createdAt).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <li className="border-fg/8 animate-fm-fade-up border-b py-4 first:pt-0 last:border-b-0">
      <div className="mb-1.5 flex items-center gap-2.5">
        <span aria-hidden="true" className={cn('size-2 rounded-full', MOOD_DOT[mood])} />
        <span className="text-fg-meta text-label tracking-ui font-sans">{date}</span>
        <span className="text-fg-muted text-label tracking-label font-sans uppercase">
          {t(`moods.${mood}`)}
        </span>
      </div>
      <p className="text-fg-body font-serif text-[clamp(16px,2vw,18px)] leading-relaxed">
        {entry.text}
      </p>
    </li>
  );
}
