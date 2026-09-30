'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel, Kicker, Textarea } from '@/components/ui';
import { useJournalStore, type JournalEntry } from '@/stores/journal-store';

const MOODS = ['calm', 'joy', 'nostalgia', 'tiredness', 'gratitude'] as const;

function EntryCard({ entry }: { entry: JournalEntry }) {
  const t = useTranslations('journal');
  const moodKey =
    entry.mood === 0
      ? 'calm'
      : entry.mood === 1
        ? 'joy'
        : entry.mood === 2
          ? 'nostalgia'
          : entry.mood === 3
            ? 'tiredness'
            : 'gratitude';

  const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="border-ivory/8 border-b py-3 last:border-b-0">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-label tracking-ui text-fg-meta font-sans">{date}</span>
        <span className="text-label tracking-label text-gold/60 font-sans uppercase">
          {t(`moods.${moodKey}`)}
        </span>
      </div>
      <p className="text-body text-fg-body font-serif leading-relaxed">{entry.text}</p>
    </div>
  );
}

export function JournalPanel() {
  const tJournal = useTranslations('journal');
  const tCommon = useTranslations('common');
  const { draft, entries, setMood, setText, save, discard } = useJournalStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    save(new Date());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <GlassPanel className="p-5">
      <Kicker tone="gold" spacing="widest" className="mb-4">
        {tJournal('kicker')}
      </Kicker>

      <p className="text-ivory mb-5 font-serif text-[22px] leading-tight">{tJournal('title')}</p>

      <p className="text-label tracking-label text-fg-meta mb-3 font-sans uppercase">
        {tJournal('moodLabel')}
      </p>

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={tJournal('moodLabel')}>
        {MOODS.map((mood, index) => (
          <button
            key={mood}
            type="button"
            onClick={() => setMood(index)}
            aria-pressed={draft.mood === index}
            className={`rounded-pill text-label tracking-ui min-h-11 flex-1 basis-[86px] px-3 py-2 font-sans uppercase transition-[color,background-color,border-color] duration-300 ${
              draft.mood === index
                ? 'bg-gold/15 text-gold border-gold/40 border'
                : 'bg-glass text-fg-meta border-glass-brd hover:border-ivory/20 border'
            }`}
          >
            {tJournal(`moods.${mood}`)}
          </button>
        ))}
      </div>

      <Textarea
        aria-label={tJournal('placeholder')}
        variant="journal"
        placeholder={tJournal('placeholder')}
        rows={4}
        value={draft.text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
      />

      <div className="flex gap-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!draft.text.trim() || draft.mood === null}
        >
          {saved ? '✓' : tJournal('save')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={discard}
          disabled={!draft.text.trim() && draft.mood === null}
        >
          {tCommon('close')}
        </Button>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {saved ? tJournal('saved') : ''}
      </p>
    </GlassPanel>
  );
}
