import { describe, expect, it } from 'vitest';

import { PLAYABLE_AUDIOS } from '@/data';
import { advanceClock, nextAudioId, previousAudioId, progressPercent } from '@/lib/player/progress';

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

describe('advanceClock', () => {
  it('avanza el reloj sin haber terminado', () => {
    expect(advanceClock(10, 1, 60)).toEqual({ elapsed: 11, ended: false });
  });

  it('se detiene en el final y avisa', () => {
    expect(advanceClock(59, 5, 60)).toEqual({ elapsed: 60, ended: true });
  });

  it('acota una posición buscada fuera del video', () => {
    expect(advanceClock(-20, 0, 60).elapsed).toBe(0);
    expect(advanceClock(500, 0, 60).elapsed).toBe(60);
  });
});

describe('nextAudioId', () => {
  it('el siguiente audio envuelve al principio', () => {
    expect(nextAudioId('n2', PLAYABLE_AUDIOS)).toBe('a1');
  });

  it('el siguiente audio avanza uno', () => {
    expect(nextAudioId('a3', PLAYABLE_AUDIOS)).toBe('a4');
  });
});

describe('previousAudioId', () => {
  it('el anterior retrocede uno', () => {
    expect(previousAudioId('a4', PLAYABLE_AUDIOS)).toBe('a3');
  });

  it('el anterior envuelve al final desde el primero', () => {
    expect(previousAudioId('a1', PLAYABLE_AUDIOS)).toBe('n2');
  });
});
