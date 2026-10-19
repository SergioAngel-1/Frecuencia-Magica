import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import type { AtmosphereId } from '@/types/atmosphere';

/** Una opción del selector de tema: uno de los cinco temas, o «Automático» (cada lugar con el suyo). */
export type SwitcherOption = AtmosphereId | 'auto';

/** Las opciones, en el orden en que se muestran: «Automático» y, debajo, los cinco temas. */
export function switcherOptions(): readonly SwitcherOption[] {
  return ['auto', ...ATMOSPHERE_IDS];
}

/** La opción pulsada: la elección guardada, o «Automático» si no hay ninguna. */
export function pressedOption(choice: AtmosphereId | null): SwitcherOption {
  return choice ?? 'auto';
}
