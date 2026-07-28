import { describe, expect, it } from 'vitest';

import { baseNoteForRealm, voiceFrequencies } from '@/lib/audio/drone';
import type { RealmId } from '@/types/realm';

describe('baseNoteForRealm', () => {
  it('cada realm tiene su nota base', () => {
    expect(baseNoteForRealm('portal')).toBe(110);
    expect(baseNoteForRealm('home')).toBe(110);
    expect(baseNoteForRealm('auth')).toBe(110);
    expect(baseNoteForRealm('descubrete')).toBe(98);
    expect(baseNoteForRealm('biblioteca')).toBe(130.8);
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
