import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import type { AtmosphereId } from '@/types/atmosphere';

/** Una opción del selector de tema: uno de los cinco temas, o «Automático» (cada lugar con el suyo). */
export type SwitcherOption = AtmosphereId | 'auto';

/** Las opciones, en el orden en que se muestran: los cinco temas y «Automático» al final. */
export function switcherOptions(): readonly SwitcherOption[] {
  return [...ATMOSPHERE_IDS, 'auto'];
}

/** La opción pulsada: la elección guardada, o «Automático» si no hay ninguna. */
export function pressedOption(choice: AtmosphereId | null): SwitcherOption {
  return choice ?? 'auto';
}
