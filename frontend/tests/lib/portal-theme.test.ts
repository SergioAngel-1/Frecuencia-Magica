import { describe, expect, it } from 'vitest';

import { portalThemeFor } from '@/lib/portal/theme';

describe('portalThemeFor: el tema con el que se pinta el cruce', () => {
  it('toma el tema de la ruta de destino, no el de la vista de origen', () => {
    expect(portalThemeFor('/inicio', 'dawn', null)).toBe('night');
    expect(portalThemeFor('/en/store', 'night', null)).toBe('dawn');
    expect(portalThemeFor('/academia', 'night', null)).toBe('forest');
  });

  it('la elección de la persona manda sobre el tema que sugiere el destino', () => {
    expect(portalThemeFor('/academia', 'night', 'moon')).toBe('moon');
    expect(portalThemeFor('/inicio', 'dawn', 'dusk')).toBe('dusk');
  });

  it('sin destino (revelación en sitio) conserva el tema visible', () => {
    expect(portalThemeFor(null, 'moon', null)).toBe('moon');
    expect(portalThemeFor(null, 'forest', 'dawn')).toBe('forest');
  });
});
