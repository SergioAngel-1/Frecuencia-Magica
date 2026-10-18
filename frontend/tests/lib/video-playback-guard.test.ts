import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Guarda de código (T2.11): un control de reproducción sin fuente es el play
 * falso que Marisol no quiere. `VideoPlayer` exige `src`; el único que lo
 * monta es `VideoSlot`, y sólo con fuente. Sin ella, `VideoSlot` pinta el
 * póster con «Próximamente», sin botón ni reloj.
 */
const PLAYER = 'components/features/player/video-player.tsx';
const SLOT = 'components/features/player/video-slot.tsx';

describe('ningún control de video sin fuente', () => {
  it('VideoPlayer exige la fuente (no es opcional)', () => {
    const source = readSource(`${SRC}/${PLAYER}`);

    expect(source).toMatch(/\n {2}src: string;/);
    expect(source).not.toMatch(/\n {2}src\?:/);
  });

  it('sólo VideoSlot monta VideoPlayer', () => {
    const users = sourceFiles(SRC)
      .map(fromSrc)
      .filter((file) => file !== PLAYER && readSource(`${SRC}/${file}`).includes('<VideoPlayer'));

    expect(users).toEqual([SLOT]);
  });

  it('VideoSlot monta el reproductor sólo cuando el estado es «ready»', () => {
    const source = readSource(`${SRC}/${SLOT}`);

    expect(source).toContain("videoState(video) === 'ready'");
    expect(source.indexOf("videoState(video) === 'ready'")).toBeLessThan(
      source.indexOf('<VideoPlayer'),
    );
    expect(source).not.toContain('PlayerBar');
    expect(source).not.toContain('PlayPauseIcon');
  });

  it('useVideoPlayback ya no tiene reloj simulado', () => {
    const source = readSource(`${SRC}/hooks/use-video-playback.ts`);

    expect(source).not.toContain('setInterval');
    expect(source).not.toContain('advanceClock');
    expect(source).not.toContain('TODO(backend)');
  });

  it('ni el hook, ni el reproductor ni la lección dejan un TODO(backend) por el video simulado', () => {
    for (const file of [
      'hooks/use-video-playback.ts',
      PLAYER,
      'components/features/academy/lesson-player.tsx',
    ]) {
      expect(readSource(`${SRC}/${file}`), file).not.toContain('TODO(backend)');
    }
  });
});
