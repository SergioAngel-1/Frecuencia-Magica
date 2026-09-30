'use client';

import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';
import type { JournalEntry } from '@/stores/journal-store';

/** Índice del estado de ánimo → clave de traducción. */
export const MOODS = ['calm', 'joy', 'nostalgia', 'tiredness', 'gratitude'] as const;

/**
 * Punto de color de cada estado, dentro de la paleta cerrada: los tres
 * acentos para los tres estados con carga emocional y dos pasos de marfil
 * para el cansancio (apagado) y la gratitud (pleno).
 */
const MOOD_DOT: Record<(typeof MOODS)[number], string> = {
  calm: 'bg-teal',
  joy: 'bg-gold',
  nostalgia: 'bg-lav',
  tiredness: 'bg-ivory/45',
  gratitude: 'bg-ivory',
};

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const t = useTranslations('journal');
  const locale = useLocale();
  const mood = MOODS[entry.mood] ?? MOODS[0];
  const date = new Date(entry.createdAt).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <li className="border-ivory/8 animate-fm-fade-up border-b py-4 first:pt-0 last:border-b-0">
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
