import { describe, expect, it, vi } from 'vitest';

import { baseNoteFor, baseNoteForRealm, createDrone, voiceFrequencies } from '@/lib/audio/drone';
import type { RealmId } from '@/types/realm';

describe('baseNoteForRealm', () => {
  it('cada realm tiene su nota base', () => {
    expect(baseNoteForRealm('portal')).toBe(110);
    expect(baseNoteForRealm('home')).toBe(110);
    expect(baseNoteForRealm('auth')).toBe(110);
    expect(baseNoteForRealm('descubrete')).toBe(98);
    expect(baseNoteForRealm('resonario')).toBe(130.8);
    expect(baseNoteForRealm('academia')).toBe(146.8);
    expect(baseNoteForRealm('experiencias')).toBe(123.4);
    expect(baseNoteForRealm('tienda')).toBe(116.5);
    expect(baseNoteForRealm('sanctuario')).toBe(103.8);
  });

  it('la afinación por defecto es 110 Hz', () => {
    expect(baseNoteForRealm('inexistente' as RealmId)).toBe(110);
  });
});

describe('voiceFrequencies', () => {
  it('las tres voces forman el acorde del prototipo', () => {
    const [a, b, c] = voiceFrequencies(110);
    expect(a).toBeCloseTo(110, 3);
    expect(b).toBeCloseTo(110.55, 3);
    expect(c).toBeCloseTo(165, 3);
  });
});

describe('baseNoteFor', () => {
  it('keeps the realm note in the default theme of a place', () => {
    expect(baseNoteFor('night', 'resonario')).toBe(130.8);
    expect(baseNoteFor('moon', 'descubrete')).toBe(98);
    expect(baseNoteFor('moon', 'sanctuario')).toBe(103.8);
  });

  it('uses the note of the theme the person chose', () => {
    expect(baseNoteFor('dusk', 'resonario')).toBe(87.3);
    expect(baseNoteFor('dawn', 'resonario')).toBe(146.8);
    expect(baseNoteFor('dawn', 'sanctuario')).toBe(146.8);
  });

  it('keeps the realm note when the theme is the one the place suggests', () => {
    expect(baseNoteFor('forest', 'academia')).toBe(baseNoteForRealm('academia'));
    expect(baseNoteFor('dawn', 'tienda')).toBe(116.5);
  });

  it('uses the note of the theme the person chose, at any place', () => {
    expect(baseNoteFor('dusk', 'academia')).toBe(87.3);
    expect(baseNoteFor('forest', 'tienda')).toBe(123.5);
  });

  it('gives the portal and home their own realm note', () => {
    expect(baseNoteFor('night', 'portal')).toBe(110);
    expect(baseNoteFor('night', 'home')).toBe(110);
  });
});

/** Contexto de Web Audio mínimo: registra el `frequency` de cada oscilador para ver el re-afinado. */
function fakeContext() {
  const voices: Array<{ frequency: { value: number; setTargetAtTime: ReturnType<typeof vi.fn> } }> =
    [];
  const param = () => ({ value: 0, setTargetAtTime: vi.fn() });
  const node = () => ({
    gain: param(),
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });
  const ctx = {
    state: 'running',
    currentTime: 3,
    destination: {},
    createGain: vi.fn(node),
    createBiquadFilter: vi.fn(() => ({ ...node(), frequency: param(), connect: vi.fn() })),
    createOscillator: vi.fn(() => {
      const osc = {
        frequency: param(),
        type: 'sine',
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      voices.push(osc);
      return osc;
    }),
    close: vi.fn(),
  };
  return { ctx: ctx as unknown as AudioContext, voices };
}

describe('drone retune', () => {
  it('slides to the new note with a time constant instead of jumping', () => {
    const { ctx, voices } = fakeContext();
    const drone = createDrone(ctx);
    const before = voices.map((v) => v.frequency.value);

    drone.retune(baseNoteFor('dusk', 'resonario'));

    // Las tres voces (la cuarta oscilador es el LFO) se deslizan hacia la nueva nota
    // con una constante de tiempo positiva: nunca un salto.
    const targets = voiceFrequencies(baseNoteFor('dusk', 'resonario'));
    const calls = voices.slice(0, 3).map((v) => v.frequency.setTargetAtTime.mock.calls[0]);
    expect(calls).toEqual(targets.map((freq) => [freq, 3, 2]));
    // Y no se reasigna el valor de golpe: el de partida se conserva hasta que el deslizamiento corre.
    expect(voices.map((v) => v.frequency.value)).toEqual(before);
  });
});
