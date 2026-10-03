import { describe, expect, it } from 'vitest';

import { AUDIOS } from '@/data';
import { nextAudioId, previousAudioId, progressPercent } from '@/lib/player/progress';

describe('progressPercent', () => {
  it('calcula el porcentaje transcurrido', () => {
    expect(progressPercent(540, 1080)).toBe(50);
  });

  it('nunca supera el cien por cien', () => {
    expect(progressPercent(2000, 1080)).toBe(100);
  });

  it('nunca baja de cero', () => {
    expect(progressPercent(-5, 1080)).toBe(0);
  });

  it('con duración cero devuelve cero', () => {
    expect(progressPercent(10, 0)).toBe(0);
  });
});

describe('nextAudioId', () => {
  it('el siguiente audio envuelve al principio', () => {
    expect(nextAudioId('a7', AUDIOS)).toBe('a1');
  });

  it('el siguiente audio avanza uno', () => {
    expect(nextAudioId('a3', AUDIOS)).toBe('a4');
  });
});

describe('previousAudioId', () => {
  it('el anterior retrocede uno', () => {
    expect(previousAudioId('a4', AUDIOS)).toBe('a3');
  });

  it('el anterior envuelve al final desde el primero', () => {
    expect(previousAudioId('a1', AUDIOS)).toBe('a7');
  });
});
