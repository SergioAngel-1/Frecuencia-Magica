import { describe, expect, it } from 'vitest';

import { suggestAudios } from '@/lib/resonario/suggestions';
import type { Audio, AudioId, Intent } from '@/types/content';

const audio = (id: AudioId, intents: Intent[]): Audio => ({
  id,
  kind: 'frequency',
  titleKey: `resonario.audios.${id}.title`,
  tagKey: 'resonario.tags.meditation',
  tagId: 'meditation',
  duration: '10:00',
  hz: 432,
  band: 'none',
  voice: false,
  availability: 'ready',
  source: { type: 'synth', recipe: { tone: { hz: 432 } } },
  license: 'synthetic',
  headphones: false,
  compositionKey: `resonario.audios.${id}.composition`,
  guideKey: `resonario.audios.${id}.guide`,
  intents,
});

const CATALOG = [
  audio('a1', ['calm', 'rest']),
  audio('a2', ['clarity']),
  audio('a3', ['calm']),
  audio('a4', ['rest', 'calm']),
  audio('a5', ['bond']),
];

describe('suggestAudios', () => {
  it('ranks by shared intents and never suggests the current audio', () => {
    expect(suggestAudios(CATALOG, 'a1', 3).map((a) => a.id)).toEqual(['a4', 'a3', 'a2']);
  });

  it('keeps the catalog order between equally close audios', () => {
    expect(suggestAudios(CATALOG, 'a5', 2).map((a) => a.id)).toEqual(['a1', 'a2']);
  });

  it('falls back to the catalog order when the current audio is unknown', () => {
    expect(suggestAudios(CATALOG, 'missing', 2).map((a) => a.id)).toEqual(['a1', 'a2']);
  });

  it('returns at most what the catalog has and nothing for a non-positive count', () => {
    expect(suggestAudios(CATALOG, 'a1', 99)).toHaveLength(4);
    expect(suggestAudios(CATALOG, 'a1', 0)).toEqual([]);
    expect(suggestAudios(CATALOG, 'a1', -1)).toEqual([]);
  });
});
