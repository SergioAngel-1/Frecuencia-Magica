'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel, Kicker, Textarea } from '@/components/ui';
import { useJournalStore, type JournalEntry } from '@/stores/journal-store';

const MOODS = ['calm', 'joy', 'nostalgia', 'tiredness', 'gratitude'] as const;

function EntryCard({ entry }: { entry: JournalEntry }) {
  const t = useTranslations('journal');
  const moodKey = entry.mood === 0 ? 'calm' : entry.mood === 1 ? 'joy' : entry.mood === 2 ? 'nostalgia' : entry.mood === 3 ? 'tiredness' : 'gratitude';

  const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="border-b border-ivory/8 py-3 last:border-b-0">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-sans text-[11px] tracking-[.1em] text-ivory/40">{date}</span>
        <span className="font-sans text-[11px] uppercase tracking-[.14em] text-gold/60">
          {t(`moods.${moodKey}`)}
        </span>
      </div>
      <p className="font-serif text-[15px] leading-relaxed text-ivory/80">{entry.text}</p>
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

      <p className="mb-5 font-serif text-[22px] leading-tight text-ivory">{tJournal('title')}</p>

      <p className="mb-3 font-sans text-[11px] uppercase tracking-[.14em] text-ivory/55">
        {tJournal('moodLabel')}
      </p>

      <div className="mb-5 flex gap-2">
        {MOODS.map((mood, index) => (
          <button
            key={mood}
            type="button"
            onClick={() => setMood(index)}
            className={`rounded-pill min-h-10 flex-1 px-3 py-2 font-sans text-[11px] uppercase tracking-[.12em] transition-all duration-300 ${
              draft.mood === index
                ? 'bg-gold/15 text-gold border border-gold/40'
                : 'bg-glass text-ivory/50 border border-glass-brd hover:border-ivory/20'
            }`}
          >
            {tJournal(`moods.${mood}`)}
          </button>
        ))}
      </div>

      <Textarea
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
    </GlassPanel>
  );
}
