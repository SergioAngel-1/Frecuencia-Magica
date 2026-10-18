import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { AUDIO_KINDS } from '@/config/audio-kinds';
import { AUDIOS, isPlayable, PLAYABLE_AUDIOS } from '@/data';
import type { Audio, AudioKind } from '@/types/content';

const KINDS: readonly AudioKind[] = ['melody', 'nature', 'frequency', 'binaural', 'guided'];

/** Resuelve una clave con puntos dentro de un catálogo de mensajes. */
function hasMessage(messages: unknown, key: string): boolean {
  let node: unknown = messages;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null || !(part in node)) return false;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' && node.length > 0;
}

/** Una receta con sólo un tono puro es `synthetic`; con binaural, mar o lluvia, `provisional`. */
function expectedSyntheticLicense(audio: Audio): 'synthetic' | 'provisional' | null {
  if (audio.source?.type !== 'synth') return null;
  const { binaural, sea, rain } = audio.source.recipe;
  return binaural || sea || rain ? 'provisional' : 'synthetic';
}

describe('modelo de catálogo de audio', () => {
  it('los ids son únicos', () => {
    const ids = AUDIOS.map((audio) => audio.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda pista lista (ready) tiene fuente', () => {
    for (const audio of AUDIOS.filter((item) => item.availability === 'ready')) {
      expect(audio.source, audio.id).not.toBeNull();
    }
  });

  it('toda pista pendiente (soon) no tiene fuente, duración ni Hz', () => {
    for (const audio of AUDIOS.filter((item) => item.availability === 'soon')) {
      expect(audio.source, audio.id).toBeNull();
      expect(audio.duration, audio.id).toBeNull();
      expect(audio.hz, audio.id).toBeNull();
    }
  });

  it('isPlayable es falso para soon y verdadero para ready', () => {
    for (const audio of AUDIOS) {
      expect(isPlayable(audio), audio.id).toBe(audio.availability === 'ready');
    }
  });

  it('el catálogo reproducible contiene sólo pistas listas con fuente', () => {
    expect(PLAYABLE_AUDIOS.length).toBeGreaterThan(0);
    for (const audio of PLAYABLE_AUDIOS) {
      expect(audio.availability, audio.id).toBe('ready');
      expect(audio.source, audio.id).not.toBeNull();
    }
  });

  it('las pistas listas declaran una duración mm:ss', () => {
    for (const audio of AUDIOS.filter((item) => item.availability === 'ready')) {
      expect(audio.duration, audio.id).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it('cada pista sintética declara su licencia: tono = synthetic, binaural/mar/lluvia = provisional', () => {
    for (const audio of AUDIOS) {
      const expected = expectedSyntheticLicense(audio);
      if (expected !== null) expect(audio.license, audio.id).toBe(expected);
    }
  });

  it('toda pista pendiente declara provisional o propia, nunca una licencia inventada', () => {
    for (const audio of AUDIOS.filter((item) => item.availability === 'soon')) {
      expect(['provisional', 'own'], audio.id).toContain(audio.license);
    }
  });

  it('los Hz sólo existen en los tonos puros: la cifra del tono es la de su receta', () => {
    for (const audio of AUDIOS) {
      const tone = audio.source?.type === 'synth' ? audio.source.recipe.tone : undefined;
      expect(audio.hz, audio.id).toBe(tone?.hz ?? null);
    }
  });

  it('las siete frecuencias del prototipo conservan sus Hz y son tonos listos', () => {
    const frequencies = AUDIOS.filter((audio) => audio.kind === 'frequency');
    expect(frequencies.map((audio) => audio.hz)).toEqual([432, 528, 396, 174, 639, 417, 528]);
    expect(frequencies.every((audio) => audio.availability === 'ready')).toBe(true);
  });

  it('cada tipo de escucha tiene al menos una pista y ninguna usa un tipo desconocido', () => {
    for (const kind of KINDS) {
      expect(
        AUDIOS.some((audio) => audio.kind === kind),
        kind,
      ).toBe(true);
    }
    for (const audio of AUDIOS) {
      expect(KINDS, audio.id).toContain(audio.kind);
    }
  });

  it('las guiadas llevan voz y los binaurales piden auriculares', () => {
    for (const audio of AUDIOS.filter((item) => item.kind === 'guided')) {
      expect(audio.voice, audio.id).toBe(true);
    }
    for (const audio of AUDIOS.filter((item) => item.kind === 'binaural')) {
      expect(audio.headphones, audio.id).toBe(true);
    }
  });

  it('cada pista tiene composición y guía de escucha con copy en ES y EN', () => {
    for (const audio of AUDIOS) {
      for (const key of [audio.titleKey, audio.compositionKey, audio.guideKey]) {
        expect(hasMessage(esMessages, key), `es ${key}`).toBe(true);
        expect(hasMessage(enMessages, key), `en ${key}`).toBe(true);
      }
    }
  });
});

describe('tipos de escucha', () => {
  it('AUDIO_KINDS presenta los cinco tipos una sola vez, en orden', () => {
    expect(AUDIO_KINDS.map((entry) => entry.kind)).toEqual(KINDS);
  });

  it('cada tipo tiene nombre y explicación en ES y EN, y su slug de banner es el suyo', () => {
    for (const entry of AUDIO_KINDS) {
      for (const key of [entry.titleKey, entry.explanationKey]) {
        expect(hasMessage(esMessages, key), `es ${key}`).toBe(true);
        expect(hasMessage(enMessages, key), `en ${key}`).toBe(true);
      }
      expect(entry.bannerSlug).toBe(entry.kind);
    }
  });
});
