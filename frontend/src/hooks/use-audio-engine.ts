'use client';

import { useSyncExternalStore } from 'react';

import { sharedAudioEngine } from '@/lib/audio/engine/shared-engine';
import type { AudioEngine, EngineSnapshot } from '@/lib/audio/engine/engine';

function subscribeToEngine(onChange: () => void): () => void {
  return sharedAudioEngine.subscribe(() => onChange());
}

/** El motor y su última foto; la interfaz se repinta sólo cuando cambia algo que suena. */
export function useAudioEngine(): { engine: AudioEngine; snapshot: EngineSnapshot } {
  const snapshot = useSyncExternalStore(
    subscribeToEngine,
    sharedAudioEngine.getSnapshot,
    sharedAudioEngine.getSnapshot,
  );

  return { engine: sharedAudioEngine, snapshot };
}
