'use client';

import { useSyncExternalStore } from 'react';

import { getSharedAudioContext } from '@/lib/audio/engine/context';
import {
  createAudioEngine,
  type AudioEngine,
  type EngineSnapshot,
} from '@/lib/audio/engine/engine';

/**
 * El motor de la web: uno solo, sobre el contexto compartido con el drone. No
 * crea nada al montarse; el contexto nace en el primer gesto que pide sonar.
 */
export const audioEngine: AudioEngine = createAudioEngine({
  getContext: getSharedAudioContext,
});

function subscribeToEngine(onChange: () => void): () => void {
  return audioEngine.subscribe(() => onChange());
}

/** El motor y su última foto; la interfaz se repinta sólo cuando cambia algo que suena. */
export function useAudioEngine(): { engine: AudioEngine; snapshot: EngineSnapshot } {
  const snapshot = useSyncExternalStore(
    subscribeToEngine,
    audioEngine.getSnapshot,
    audioEngine.getSnapshot,
  );

  return { engine: audioEngine, snapshot };
}
