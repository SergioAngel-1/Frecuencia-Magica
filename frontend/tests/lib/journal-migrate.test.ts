import { describe, expect, it } from 'vitest';

import { JOURNAL_STORE_VERSION, migrateJournal } from '@/lib/journal/migrate';

/** Entradas tal como las guardaba la v1: el ánimo era un índice de cinco. */
const V0_ENTRY = (index: unknown, text: string, id: string) => ({
  id,
  mood: index,
  text,
  createdAt: '2026-07-28T10:00:00.000Z',
});

describe('migrateJournal', () => {
  it('la versión actual del diario es 1', () => {
    expect(JOURNAL_STORE_VERSION).toBe(1);
  });

  it('una entrada v1 con cada índice migra a su id (calma, alegría, nostalgia, cansancio, gratitud)', () => {
    const persisted = {
      state: {
        entries: [0, 1, 2, 3, 4].map((index) => V0_ENTRY(index, `texto ${index}`, `e${index}`)),
        draft: { mood: null, text: '' },
      },
      version: 0,
    };

    const migrated = migrateJournal(persisted.state, 0);

    expect(migrated.entries.map((entry) => entry.mood)).toEqual([
      'calm',
      'joy',
      'nostalgia',
      'tiredness',
      'gratitude',
    ]);
  });

  it('no pierde nada: id, texto y fecha de cada entrada se conservan y el orden también', () => {
    const migrated = migrateJournal(
      { entries: [V0_ENTRY(3, 'primera', 'a'), V0_ENTRY(0, 'segunda', 'b')] },
      0,
    );

    expect(migrated.entries).toEqual([
      { id: 'a', mood: 'tiredness', text: 'primera', createdAt: '2026-07-28T10:00:00.000Z' },
      { id: 'b', mood: 'calm', text: 'segunda', createdAt: '2026-07-28T10:00:00.000Z' },
    ]);
  });

  it('el borrador migra igual que las entradas', () => {
    const migrated = migrateJournal({ draft: { mood: 4, text: 'a medio escribir' } }, 0);

    expect(migrated.draft).toEqual({ mood: 'gratitude', text: 'a medio escribir' });
  });

  it('un índice fuera de rango no rompe: queda en null y la entrada se conserva', () => {
    const migrated = migrateJournal({ entries: [V0_ENTRY(9, 'sin etiqueta', 'x')] }, 0);

    expect(migrated.entries).toHaveLength(1);
    expect(migrated.entries[0]!.mood).toBeNull();
    expect(migrated.entries[0]!.text).toBe('sin etiqueta');
  });

  it('un índice negativo, decimal o no numérico queda en null', () => {
    for (const bad of [-1, 2.5, 'dos', null, undefined, {}]) {
      const migrated = migrateJournal({ entries: [V0_ENTRY(bad, 'x', 'y')] }, 0);
      expect(migrated.entries[0]!.mood, String(bad)).toBeNull();
    }
  });

  it('una versión 1 con id conocido se respeta, y un id desconocido queda en null', () => {
    const migrated = migrateJournal(
      {
        entries: [
          { id: 'a', mood: 'sadness', text: 'acompañada', createdAt: '2026-10-01T10:00:00.000Z' },
          { id: 'b', mood: 'inventado', text: 'otra', createdAt: '2026-10-01T10:00:00.000Z' },
        ],
      },
      1,
    );

    expect(migrated.entries.map((entry) => entry.mood)).toEqual(['sadness', null]);
  });

  it('un estado corrupto no rompe: sin datos útiles, diario vacío', () => {
    for (const corrupt of [null, undefined, 'roto', 42, []]) {
      expect(migrateJournal(corrupt, 0)).toEqual({
        entries: [],
        draft: { mood: null, text: '' },
      });
    }
  });

  it('una entrada sin texto ni fecha válidos se descarta; las demás sobreviven', () => {
    const migrated = migrateJournal(
      {
        entries: [
          V0_ENTRY(0, 'buena', 'ok'),
          { id: 'mala', mood: 0, text: 42, createdAt: '2026-07-28T10:00:00.000Z' },
          'basura',
        ],
      },
      0,
    );

    expect(migrated.entries.map((entry) => entry.id)).toEqual(['ok']);
  });

  it('un borrador corrupto cae a vacío sin tocar las entradas', () => {
    const migrated = migrateJournal({ entries: [V0_ENTRY(1, 'se queda', 'k')], draft: 'roto' }, 0);

    expect(migrated.entries).toHaveLength(1);
    expect(migrated.draft).toEqual({ mood: null, text: '' });
  });
});
