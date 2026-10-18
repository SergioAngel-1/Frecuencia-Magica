import { getSharedAudioContext } from './context';
import { createAudioEngine, type AudioEngine } from './engine';

/**
 * El motor de la web: uno solo, sobre el contexto compartido con el drone. No
 * crea nada al cargarse; el contexto nace en el primer gesto que pide sonar.
 */
export const sharedAudioEngine: AudioEngine = createAudioEngine({
  getContext: getSharedAudioContext,
});
