'use client';

import { useEffect, useRef } from 'react';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useRealm } from '@/hooks/use-realm';
import { ambientAudible } from '@/lib/audio/ambient-mix';
import { baseNoteFor, createDrone, type DroneHandle } from '@/lib/audio/drone';
import { getSharedAudioContext } from '@/lib/audio/engine/context';
import { useAmbientStore } from '@/stores/ambient-store';
import { useIsPlayerSounding } from '@/stores/player-store';

/**
 * Conecta la preferencia de audio, el realm activo y el grafo del drone.
 *
 * El contexto compartido se pide la primera vez que el ambiente se activa —un
 * gesto, nunca el montaje— para no disparar el aviso de autoplay. Si el navegador
 * no soporta Web Audio, degrada en silencio.
 */
export function useAmbientAudio(): void {
  const enabled = useAmbientStore((state) => state.enabled);
  // Mientras suena una frecuencia, el drone se funde a silencio (su ganancia
  // baja con rampa) y vuelve al pausar o cerrar: nunca dos sonidos a la vez.
  const playerSounding = useIsPlayerSounding();
  const { realmId } = useRealm();
  const { atmosphereId } = useAtmosphere();
  // La nota sigue a la atmósfera efectiva: al cambiarla, el drone se re-afina y desliza.
  const baseNote = baseNoteFor(atmosphereId, realmId);
  const droneRef = useRef<DroneHandle | null>(null);

  useEffect(() => {
    if (!enabled) {
      droneRef.current?.setEnabled(false);
      return;
    }

    if (!droneRef.current) {
      const ctx = getSharedAudioContext();
      if (!ctx) return; // Sin Web Audio: degrada en silencio.
      const drone = createDrone(ctx);
      drone.retune(baseNote);
      droneRef.current = drone;
    }

    droneRef.current.setEnabled(ambientAudible(enabled, playerSounding));
  }, [enabled, playerSounding, baseNote]);

  useEffect(() => {
    droneRef.current?.retune(baseNote);
  }, [baseNote]);

  useEffect(() => {
    return () => {
      droneRef.current?.dispose();
      droneRef.current = null;
    };
  }, []);
}
