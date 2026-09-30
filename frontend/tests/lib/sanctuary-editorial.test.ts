import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { AUDIOS, COURSES } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { MOCK_PROFILE } from '@/lib/sanctuary/profile';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/mi-santuario/page.tsx');
const loadingSource = readSource('app/[locale]/mi-santuario/loading.tsx');
const headerSource = readSource('components/features/sanctuary/sanctuary-header.tsx');
const statsSource = readSource('components/features/sanctuary/stats-row.tsx');
const continueSource = readSource('components/features/sanctuary/continue-card.tsx');
const dailySource = readSource('components/features/sanctuary/daily-card.tsx');
const journalSource = readSource('components/features/sanctuary/journal-panel.tsx');
const emptySource = readSource('components/features/sanctuary/journal-empty.tsx');

const SANCTUARY_SLOTS = [
  { slot: 'sanctuary.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'sanctuary.continue' as const, aspect: '16:8' as const, alt: 'continue' },
  { slot: 'sanctuary.daily' as const, aspect: '1:1' as const, alt: 'daily' },
  { slot: 'sanctuary.journal' as const, aspect: '3:4' as const, alt: 'journal' },
  { slot: 'sanctuary.empty' as const, aspect: '16:9' as const, alt: 'empty' },
];

type SanctuaryMessages = {
  title: string;
  media: { alt: Record<string, string> };
  stats: Record<string, Record<string, string>>;
};
const es = esMessages.sanctuary as unknown as SanctuaryMessages;
const en = enMessages.sanctuary as unknown as SanctuaryMessages;

describe('sanctuary editorial composition contracts', () => {
  it('resolves all five sanctuary slots to zebra fallbacks without inventing media', () => {
    for (const { slot, aspect } of SANCTUARY_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Sanctuary ${slot}` });

      expect(media).toMatchObject({ kind: 'fallback', slot, aspect });
      expect(media.src).toBeUndefined();
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }
  });

  it('provides distinct bilingual alt copy for every slot', () => {
    for (const { alt } of SANCTUARY_SLOTS) {
      expect(es.media.alt[alt], alt).toBeTruthy();
      expect(en.media.alt[alt], alt).toBeTruthy();
      expect(en.media.alt[alt], alt).not.toBe(es.media.alt[alt]);
    }
  });

  it('wires every slot through the page with a translated alt', () => {
    expect(pageSource).toContain('const locale = await resolveLocale(params);');

    for (const { slot, alt } of SANCTUARY_SLOTS) {
      expect(pageSource).toContain(`resolveEditorialMedia('${slot}'`);
      expect(pageSource).toContain(`alt: t('media.alt.${alt}')`);
    }

    expect(pageSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-container');
  });

  it('greets by name through a message parameter instead of a hardcoded person', () => {
    expect(es.title).toContain('{name}');
    expect(en.title).toContain('{name}');
    expect(pageSource).toContain("t('title', { name: profile.name })");
    expect(pageSource).toContain('TODO(backend)');
  });

  it('does not keep invented stat values in the messages', () => {
    for (const stat of Object.values(es.stats)) expect(stat).not.toHaveProperty('value');
    for (const stat of Object.values(en.stats)) expect(stat).not.toHaveProperty('value');
  });

  it('shows the real journal count and avoids the hydration mismatch of persisted state', () => {
    expect(statsSource).toContain('useJournalStore');
    expect(statsSource).toContain('useMounted()');
    expect(journalSource).toContain('useMounted()');
    expect(journalSource).toContain('mounted ? entries : []');
  });

  it('points the daily frequency and the resume course at things that exist', () => {
    expect(AUDIOS.some((audio) => audio.id === MOCK_PROFILE.dailyAudioId)).toBe(true);
    expect(COURSES.some((course) => course.id === MOCK_PROFILE.resume.courseId)).toBe(true);
  });

  it('opens the daily frequency in the player instead of drawing a dead disc', () => {
    expect(dailySource).toContain('usePlayerStore');
    expect(dailySource).toContain('onClick={() => open(audio.id)}');
    expect(dailySource).toContain('arrowLinkClasses');
    expect(dailySource).toContain('data-editorial-media="sanctuary.daily"');
  });

  it('resumes the course with progress and a ButtonLink, never Button asChild', () => {
    expect(continueSource).toContain('<ProgressBar');
    expect(continueSource).toContain('<ButtonLink');
    expect(continueSource).not.toContain('asChild');
    expect(continueSource).toContain("pathname: '/academia/[courseId]/[lessonId]'");
    expect(continueSource).toContain('data-editorial-media="sanctuary.continue"');
  });

  it('gives the journal its portrait and an editorial empty state', () => {
    expect(journalSource).toContain('data-editorial-media="sanctuary.journal"');
    expect(journalSource).toContain('<JournalEmpty');
    expect(emptySource).toContain('data-editorial-media="sanctuary.empty"');
    expect(emptySource).toContain("t('emptyJournal')");
    expect(journalSource).toContain('aria-live="polite"');
    expect(journalSource).toContain('aria-pressed={draft.mood === index}');
  });

  it('keeps the orb decorative and the greeting as the only h1', () => {
    expect(headerSource).toContain('aria-hidden="true"');
    expect(headerSource).toContain('level="h1"');
    expect(headerSource).toContain('fm-breathe');
  });

  it('mirrors the layout in loading with zebra slots instead of gray placeholders', () => {
    expect(loadingSource).toContain('aria-busy="true"');
    expect(loadingSource).toContain('<MediaSkeleton');

    for (const slot of ['sanctuary.hero', 'sanctuary.continue', 'sanctuary.journal']) {
      expect(loadingSource).toContain(`slot="${slot}"`);
    }

    expect(loadingSource).not.toContain('bg-gray');
  });
});
