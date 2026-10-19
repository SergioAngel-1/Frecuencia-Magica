import { describe, expect, it } from 'vitest';

import { LISTENING_ATMOSPHERE, LISTENING_PLACES } from '@/config/listening-atmosphere';
import { listeningAtmosphere } from '@/lib/atmosphere/listening';

describe('listeningAtmosphere', () => {
  it('cada tipo de escucha propone su tema en Resonario', () => {
    expect(listeningAtmosphere('resonario', 'nature', true)).toBe('forest');
    expect(listeningAtmosphere('resonario', 'melody', true)).toBe('dusk');
    expect(listeningAtmosphere('resonario', 'guided', true)).toBe('dawn');
    expect(listeningAtmosphere('resonario', 'binaural', true)).toBe('moon');
    expect(listeningAtmosphere('resonario', 'frequency', true)).toBe('night');
  });

  it('el mapa cubre los cinco tipos', () => {
    expect(Object.keys(LISTENING_ATMOSPHERE).sort()).toEqual([
      'binaural',
      'frequency',
      'guided',
      'melody',
      'nature',
    ]);
  });

  it('en silencio no propone tema', () => {
    expect(listeningAtmosphere('resonario', 'nature', false)).toBeNull();
  });

  it('sin tipo de pista no propone tema', () => {
    expect(listeningAtmosphere('resonario', null, true)).toBeNull();
  });

  it('fuera de los lugares de escucha no propone tema', () => {
    expect(LISTENING_PLACES).toEqual(['resonario']);
    expect(listeningAtmosphere('academia', 'nature', true)).toBeNull();
    expect(listeningAtmosphere('portal', 'frequency', true)).toBeNull();
    expect(listeningAtmosphere('tienda', 'melody', true)).toBeNull();
  });
});
