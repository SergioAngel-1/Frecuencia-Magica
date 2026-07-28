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
    store.setMood(2);
    store.setText('Hoy me siento en paz');
    store.save(new Date('2026-07-28T10:00:00Z'));
    const state = useJournalStore.getState();
    expect(state.entries).toHaveLength(1);
    expect(state.draft.mood).toBeNull();
    expect(state.draft.text).toBe('');
  });

  it('no guarda una entrada sin texto', () => {
    const store = useJournalStore.getState();
    store.setMood(2);
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
    store.setMood(1);
    store.setText('Paz');
    store.save(new Date('2026-07-28T10:00:00Z'));
    expect(useJournalStore.getState().entries[0]!.createdAt).toBe('2026-07-28T10:00:00.000Z');
  });

  it('las entradas más recientes van primero', () => {
    const store = useJournalStore.getState();
    store.setMood(0);
    store.setText('Primera');
    store.save(new Date('2026-07-27T10:00:00Z'));
    store.setMood(1);
    store.setText('Segunda');
    store.save(new Date('2026-07-28T10:00:00Z'));
    const entries = useJournalStore.getState().entries;
    expect(entries[0]!.text).toBe('Segunda');
    expect(entries[1]!.text).toBe('Primera');
  });

  it('descartar limpia el borrador sin guardar', () => {
    const store = useJournalStore.getState();
    store.setMood(2);
    store.setText('Hoy me siento en paz');
    store.discard();
    const state = useJournalStore.getState();
    expect(state.entries).toHaveLength(0);
    expect(state.draft.mood).toBeNull();
    expect(state.draft.text).toBe('');
  });
});
