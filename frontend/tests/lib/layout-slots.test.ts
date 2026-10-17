import { describe, expect, it } from 'vitest';

import { AUDIO_KINDS } from '@/config/audio-kinds';
import { AUDIOS } from '@/data';
import { featuredAudio, filterAudios, kindSections } from '@/lib/resonario/layout-slots';

describe('filterAudios', () => {
  it('«todo» y null devuelven el catálogo completo', () => {
    expect(filterAudios(AUDIOS, 'all')).toHaveLength(AUDIOS.length);
    expect(filterAudios(AUDIOS, null)).toHaveLength(AUDIOS.length);
  });

  it('filtra por el campo kind, nunca por el texto traducido', () => {
    const binaurals = filterAudios(AUDIOS, 'binaural');

    expect(binaurals.length).toBeGreaterThan(0);
    expect(binaurals.every((audio) => audio.kind === 'binaural')).toBe(true);
  });

  it('una clave que no es un tipo no devuelve nada', () => {
    expect(filterAudios(AUDIOS, 'inexistente')).toHaveLength(0);
  });
});

describe('featuredAudio', () => {
  it('la destacada es la primera frecuencia de tono que puede sonar', () => {
    expect(featuredAudio(AUDIOS)?.id).toBe('a1');
  });

  it('sin frecuencias listas no hay destacada', () => {
    expect(featuredAudio([])).toBeUndefined();
    expect(featuredAudio(AUDIOS.filter((audio) => audio.kind !== 'frequency'))).toBeUndefined();
  });
});

describe('kindSections', () => {
  it('presenta un tipo por sección, en el orden del catálogo de tipos', () => {
    const sections = kindSections(AUDIOS, null);

    expect(sections.map((section) => section.entry.kind)).toEqual(
      AUDIO_KINDS.map((entry) => entry.kind),
    );
  });

  it('cada sección sólo lleva pistas de su tipo', () => {
    for (const section of kindSections(AUDIOS, null)) {
      for (const audio of section.tracks) {
        expect(audio.kind).toBe(section.entry.kind);
      }
    }
  });

  it('con un filtro, sólo aparece la sección de ese tipo', () => {
    const sections = kindSections(AUDIOS, 'nature');

    expect(sections).toHaveLength(1);
    expect(sections[0]!.entry.kind).toBe('nature');
  });

  it('quita la destacada de su sección sin tocar el resto', () => {
    const frequency = kindSections(AUDIOS, 'frequency', 'a1')[0]!;

    expect(frequency.tracks.map((audio) => audio.id)).not.toContain('a1');
    expect(frequency.tracks).toHaveLength(6);
  });

  it('un filtro sin pistas no genera sección', () => {
    expect(kindSections([], null)).toEqual([]);
  });
});
