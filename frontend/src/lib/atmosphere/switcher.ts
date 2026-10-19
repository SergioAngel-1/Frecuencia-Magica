import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import type { AtmosphereId } from '@/types/atmosphere';
import { MOOD_IDS, type MoodId } from '@/types/mood';

/** Un tema directo, o «Automático» (cada lugar con el suyo). */
export type ThemeSwitcherOption = AtmosphereId | 'auto';

/** Una emoción del portal, con el tema que propone. */
export type MoodSwitcherOption = `mood:${MoodId}`;

/** Una opción del selector de tema: un tema, «Automático» o una emoción. */
export type SwitcherOption = ThemeSwitcherOption | MoodSwitcherOption;

/** Las opciones de tema, en el orden en que se muestran: «Automático» y los cinco temas. */
export function switcherOptions(): readonly ThemeSwitcherOption[] {
  return ['auto', ...ATMOSPHERE_IDS];
}

/** Las emociones, en el orden del portal: cada una propone el tema de su llegada. */
export function feelingOptions(): readonly MoodSwitcherOption[] {
  return MOOD_IDS.map((id) => `mood:${id}` as MoodSwitcherOption);
}

/** `true` si la opción es una emoción. */
export function isMoodOption(option: SwitcherOption): option is MoodSwitcherOption {
  return option.startsWith('mood:');
}

/** La emoción de una opción, si lo es. */
export function moodOf(option: SwitcherOption): MoodId | null {
  return isMoodOption(option) ? (option.slice('mood:'.length) as MoodId) : null;
}

/** El tema que propone una emoción. */
export function moodAtmosphere(mood: MoodSwitcherOption): AtmosphereId {
  return ARRIVALS[mood].atmosphere;
}

/**
 * La opción pulsada: la emoción de origen si la elección sigue siendo el tema que propone,
 * el tema si la elección no vino de una emoción (o vino de una intención), y «Automático»
 * cuando no hay elección.
 */
export function pressedOption(
  choice: AtmosphereId | null,
  feeling: ArrivalKey | null = null,
): SwitcherOption {
  if (choice === null) return 'auto';

  const mood = moodOfFeeling(feeling);
  if (mood !== null) return ARRIVALS[mood].atmosphere === choice ? mood : choice;

  return choice;
}

/** La emoción de una llegada, si es una emoción del portal (`mood:*`). */
function moodOfFeeling(feeling: ArrivalKey | null): MoodSwitcherOption | null {
  return feeling?.startsWith('mood:') ? (feeling as MoodSwitcherOption) : null;
}
