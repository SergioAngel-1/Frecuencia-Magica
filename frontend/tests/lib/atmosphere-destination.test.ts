import { describe, expect, it } from 'vitest';

import { atmosphereForPathname } from '@/lib/atmosphere/destination';

describe('atmosphereForPathname: el tema del destino durante la espera', () => {
  it('sin elección, cada ruta resuelve el tema que sugiere su lugar', () => {
    expect(atmosphereForPathname('/academia', null)).toBe('forest');
    expect(atmosphereForPathname('/en/store', null)).toBe('dawn');
  });

  it('la elección de la persona gana en cualquier ruta', () => {
    expect(atmosphereForPathname('/academia', 'moon')).toBe('moon');
    expect(atmosphereForPathname('/en/store', 'moon')).toBe('moon');
    expect(atmosphereForPathname('/en/store', 'night')).toBe('night');
  });

  it('una ruta desconocida cae al portal y, sin elección, a la noche', () => {
    expect(atmosphereForPathname('/inexistente', null)).toBe('night');
    expect(atmosphereForPathname('/en/inexistente', null)).toBe('night');
  });

  it('la raíz es el portal: la noche', () => {
    expect(atmosphereForPathname('/', null)).toBe('night');
  });
});
