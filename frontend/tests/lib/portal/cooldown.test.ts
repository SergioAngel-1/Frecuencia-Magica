import { describe, expect, it } from 'vitest';

import { PORTAL_COOLDOWN_MS, shouldPlayPortalChoreography } from '@/lib/portal/cooldown';

describe('shouldPlayPortalChoreography', () => {
  it('la primera vez (sin cruce previo) siempre toca la coreografía', () => {
    expect(shouldPlayPortalChoreography(null, 1_000_000)).toBe(true);
  });

  it('un cruce reciente omite la coreografía', () => {
    const now = 1_000_000;

    expect(shouldPlayPortalChoreography(now - 60_000, now)).toBe(false); // 1 min
    expect(shouldPlayPortalChoreography(now - 3_600_000, now)).toBe(false); // 1 h
  });

  it('pasada la ventana de reposo vuelve a tocarla', () => {
    const now = 1_000_000;

    expect(shouldPlayPortalChoreography(now - PORTAL_COOLDOWN_MS, now)).toBe(true);
    expect(shouldPlayPortalChoreography(now - PORTAL_COOLDOWN_MS - 1, now)).toBe(true);
  });

  it('un timestamp corrupto se trata como primera vez (el lector devuelve null)', () => {
    // readLastPortalCross() devuelve null para valores no numéricos; la
    // función pura con `null` siempre toca la coreografía.
    expect(shouldPlayPortalChoreography(null, 1_000_000)).toBe(true);
  });
});
