'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, EditorialImage, GlassPanel, Kicker, Textarea } from '@/components/ui';
import { useMounted } from '@/hooks/use-mounted';
import { ArrivalCheckIn } from '@/components/features/arrival/arrival-check-in';
import { ARRIVALS } from '@/config/arrivals';
import { useArrival } from '@/hooks/use-arrival';
import { cn } from '@/lib/cn';
import { hasEditorialVisual } from '@/lib/editorial/visual';
import { useJournalStore } from '@/stores/journal-store';
import type { EditorialMedia } from '@/types/editorial-media';
import { MOOD_IDS, type MoodId } from '@/types/mood';

import { JournalEmpty } from './journal-empty';
import { JournalEntryCard } from './journal-entry';

export type JournalMedia = {
  journal: EditorialMedia;
  empty: EditorialMedia;
};

/** Cuánto dura el pulso dorado y el ✓ tras guardar. */
const SAVED_MS = 2500;

export function JournalPanel({ media }: { media: JournalMedia }) {
  const tJournal = useTranslations('journal');
  const tCommon = useTranslations('common');
  const mounted = useMounted();
  // Selectores finos: el panel sólo se re-renderiza con los campos que pinta.
  const draft = useJournalStore((s) => s.draft);
  const entries = useJournalStore((s) => s.entries);
  const setMood = useJournalStore((s) => s.setMood);
  const setText = useJournalStore((s) => s.setText);
  const save = useJournalStore((s) => s.save);
  const discard = useJournalStore((s) => s.discard);
  const { pick } = useArrival();
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // La emoción del diario también propone su tema: fija la elección global sin
  // sonido, como el check-in del portal. Re-elegir la misma no dispara un cruce.
  const handleMood = (id: MoodId) => {
    setMood(id);
    pick(`mood:${id}`);
  };

  const handleSave = () => {
    save(new Date());
    setSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), SAVED_MS);
  };

  // Hasta que el cliente ha pintado no se lee `localStorage`: el servidor no
  // tiene entradas y mostrarlas en el primer render desajusta la hidratación.
  const visibleEntries = mounted ? entries : [];
  // El cuaderno es el fondo de la página en la que se escribe; sin foto
  // publicada, el campo conserva su cristal.
  const withPage = hasEditorialVisual(media.journal);

  return (
    <div>
      <GlassPanel
        className={cn(
          'p-5 transition-[box-shadow,border-color] duration-700 sm:p-7',
          saved && 'shadow-glow-card border-accent/50',
        )}
      >
        <Kicker tone="lav" spacing="widest" className="mb-4">
          {tJournal('kicker')}
        </Kicker>

        <p className="text-fg mb-5 font-serif text-[clamp(22px,2.6vw,26px)] leading-tight">
          {tJournal('title')}
        </p>

        <p className="text-label tracking-label text-fg-meta mb-3 font-sans uppercase">
          {tJournal('moodLabel')}
        </p>

        <div className="mb-5">
          <ArrivalCheckIn
            legend={tJournal('moodLabel')}
            options={MOOD_IDS.map((id) => ({
              id,
              label: tJournal(`moods.${id}`),
              atmosphere: ARRIVALS[`mood:${id}`].atmosphere,
            }))}
            selected={draft.mood}
            onSelect={handleMood}
          />
        </div>

        {/* El diario se escribe sobre su cuaderno: la foto es el fondo del
            campo, decorativa, y un velo de noche sostiene el contraste del
            texto. El campo queda transparente para no taparla dos veces. */}
        <div
          className="rounded-field relative isolate mb-4 overflow-hidden"
          data-editorial-media="sanctuary.journal"
        >
          {withPage ? (
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <EditorialImage
                className="h-full"
                focalPoint={media.journal.position}
                media={media.journal}
                overlay={false}
                scrim={false}
              />
              <div className="bg-scrim-deep/60 absolute inset-0" />
            </div>
          ) : null}
          <Textarea
            aria-label={tJournal('placeholder')}
            variant="journal"
            placeholder={tJournal('placeholder')}
            rows={8}
            value={draft.text}
            onChange={(e) => setText(e.target.value)}
            className={cn('block', withPage && 'bg-transparent')}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!draft.text.trim() || draft.mood === null}
          >
            {saved ? '✓' : tJournal('save')}
          </Button>
          <Button
            variant="ghost"
            onClick={discard}
            disabled={!draft.text.trim() && draft.mood === null}
          >
            {tCommon('close')}
          </Button>
        </div>

        {visibleEntries.length > 0 ? (
          <ul className="mt-7">
            {visibleEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
        ) : mounted ? (
          <JournalEmpty media={media.empty} />
        ) : null}

        <p aria-live="polite" className="sr-only">
          {saved ? tJournal('saved') : ''}
        </p>
      </GlassPanel>
    </div>
  );
}
