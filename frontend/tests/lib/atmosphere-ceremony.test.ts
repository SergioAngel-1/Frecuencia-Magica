import { describe, expect, it } from 'vitest';

import { themeCeremonyActive } from '@/lib/atmosphere/ceremony';
import type { ShiftPhase } from '@/stores/atmosphere-shift-store';
import type { PortalPhase } from '@/stores/portal-store';

const PORTAL_PHASES: PortalPhase[] = ['idle', 'in', 'hold', 'out'];
const SHIFT_PHASES: ShiftPhase[] = ['idle', 'confirming', 'in', 'hold', 'out'];
/** `confirming` no es ceremonia: sólo pregunta, el tema todavía no ha cambiado. */
const CEREMONY_SHIFT_PHASES = new Set<ShiftPhase>(['in', 'hold', 'out']);

/**
 * Un solo predicado para todas las capas: hay ceremonia si el portal o el velo
 * están en marcha. Aquí se fija la tabla completa para que ninguna capa pueda
 * reinterpretarla a su manera.
 */
describe('themeCeremonyActive', () => {
  it.each(PORTAL_PHASES.flatMap((portal) => SHIFT_PHASES.map((shift) => ({ portal, shift }))))(
    'portal $portal + shift $shift',
    ({ portal, shift }) => {
      expect(themeCeremonyActive({ portal, shift })).toBe(
        portal !== 'idle' || CEREMONY_SHIFT_PHASES.has(shift),
      );
    },
  );

  it('does not count the confirmation question', () => {
    expect(themeCeremonyActive({ portal: 'idle', shift: 'confirming' })).toBe(false);
  });

  it('counts while the veil is still dissolving', () => {
    expect(themeCeremonyActive({ portal: 'idle', shift: 'out' })).toBe(true);
  });

  it('counts the portal even while the veil is only confirming', () => {
    expect(themeCeremonyActive({ portal: 'hold', shift: 'confirming' })).toBe(true);
  });
});
