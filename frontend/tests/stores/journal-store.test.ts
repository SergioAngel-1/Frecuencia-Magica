import { beforeEach, describe, expect, it } from 'vitest';

import { useJournalStore } from '@/stores/journal-store';

describe('useJournalStore', () => {
  beforeEach(() => {
    useJournalStore.setState({ entries: [], draft: { mood: null, text: '' } });
  });

  it('el diario arranca vacío y sin borrador', () => {
    const state = useJournalStore.getState();
    expect(state.entries).toHaveLength(0);
    expect(state.draft.mood).toBeNull();
    expect(state.draft.text).toBe('');
  });

  it('guardar añade una entrada y limpia el borrador', () => {
    const store = useJournalStore.getState();
    store.setMood('nostalgia');
    store.setText('Hoy me siento en paz');
    store.save(new Date('2026-07-28T10:00:00Z'));
    const state = useJournalStore.getState();
    expect(state.entries).toHaveLength(1);
    expect(state.draft.mood).toBeNull();
    expect(state.draft.text).toBe('');
  });

  it('no guarda una entrada sin texto', () => {
    const store = useJournalStore.getState();
    store.setMood('nostalgia');
    store.save(new Date());
    expect(useJournalStore.getState().entries).toHaveLength(0);
  });

  it('no guarda una entrada sin estado de ánimo', () => {
    const store = useJournalStore.getState();
    store.setText('Hoy me siento en paz');
    store.save(new Date());
    expect(useJournalStore.getState().entries).toHaveLength(0);
  });

  it('la entrada guarda la fecha proporcionada', () => {
    const store = useJournalStore.getState();
    store.setMood('joy');
    store.setText('Paz');
    store.save(new Date('2026-07-28T10:00:00Z'));
    expect(useJournalStore.getState().entries[0]!.createdAt).toBe('2026-07-28T10:00:00.000Z');
  });

  it('las entradas más recientes van primero', () => {
    const store = useJournalStore.getState();
    store.setMood('calm');
    store.setText('Primera');
    store.save(new Date('2026-07-27T10:00:00Z'));
    store.setMood('joy');
    store.setText('Segunda');
    store.save(new Date('2026-07-28T10:00:00Z'));
    const entries = useJournalStore.getState().entries;
    expect(entries[0]!.text).toBe('Segunda');
    expect(entries[1]!.text).toBe('Primera');
  });

  it('guarda el id del estado de ánimo, no un índice', () => {
    const store = useJournalStore.getState();
    store.setMood('sadness');
    store.setText('Hoy pesa un poco');
    store.save(new Date('2026-10-17T10:00:00Z'));
    expect(useJournalStore.getState().entries[0]!.mood).toBe('sadness');
  });

  it('el diario se persiste en la versión 1, con migración desde la 0', () => {
    const options = useJournalStore.persist.getOptions();
    expect(options.version).toBe(1);
    expect(options.migrate).toBeTypeOf('function');
  });

  it('rehidrata un diario v0 de localStorage: índices convertidos, nada perdido', async () => {
    const v0 = {
      state: {
        entries: [0, 1, 2, 3, 4, 7].map((mood, i) => ({
          id: `e${i}`,
          mood,
          text: `entrada ${i}`,
          createdAt: '2026-07-28T10:00:00.000Z',
        })),
        draft: { mood: 4, text: 'borrador' },
      },
      version: 0,
    };
    localStorage.setItem('fm.journal', JSON.stringify(v0));

    await useJournalStore.persist.rehydrate();

    const state = useJournalStore.getState();
    expect(state.entries.map((entry) => entry.mood)).toEqual([
      'calm',
      'joy',
      'nostalgia',
      'tiredness',
      'gratitude',
      null,
    ]);
    expect(state.entries.map((entry) => entry.text)).toEqual(v0.state.entries.map((e) => e.text));
    expect(state.draft).toEqual({ mood: 'gratitude', text: 'borrador' });
    localStorage.removeItem('fm.journal');
  });

  it('descartar limpia el borrador sin guardar', () => {
    const store = useJournalStore.getState();
    store.setMood('nostalgia');
    store.setText('Hoy me siento en paz');
    store.discard();
    const state = useJournalStore.getState();
    expect(state.entries).toHaveLength(0);
    expect(state.draft.mood).toBeNull();
    expect(state.draft.text).toBe('');
  });
});
